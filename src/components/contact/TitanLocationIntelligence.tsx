import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  InfoWindow,
  Map as GoogleMap,
  Pin,
  useAdvancedMarkerRef,
  useMap,
  useMapsLibrary,
} from '@vis.gl/react-google-maps';
import {
  Bike,
  Building2,
  Bus,
  Car,
  Check,
  Compass,
  Copy,
  Crosshair,
  ExternalLink,
  Footprints,
  Globe,
  Loader2,
  MapPin,
  Navigation,
  Search,
  Send,
  Sparkles,
} from 'lucide-react';
import { VoiceTranscribeButton } from '../ui/VoiceTranscribeButton';

export type BranchId = 'abeokuta' | 'abuja';
type TravelModeKey = 'DRIVING' | 'TWO_WHEELER' | 'TRANSIT' | 'WALKING';

interface BranchSpec {
  id: BranchId;
  badge: string;
  title: string;
  shortName: string;
  cityLabel: string;
  address: string;
  landmark: string;
  axisNote: string;
  status: 'registered' | 'tba';
  statusLabel: string;
  searchQueries: string[];
  directMapsSearchUrl: string;
  defaultZoom: number;
}

interface ResolvedPlace {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  viewport?: google.maps.LatLngBounds | null;
  googleMapsURI?: string | null;
  primaryType?: string | null;
}

interface NearbyLandmark {
  id: string;
  displayName: string;
  formattedAddress: string;
  location: google.maps.LatLngLiteral;
  primaryType: string;
  googleMapsURI?: string | null;
}

interface RouteSummary {
  distanceMeters: number;
  durationMillis: number;
  firstInstruction?: string;
  mode: TravelModeKey;
  originLabel: string;
}

interface MapsGroundingSource {
  title: string;
  uri: string;
  snippet?: string;
}

const GROUNDING_QUICK_PROMPTS: Record<BranchId, string[]> = {
  abeokuta: [
    'Restaurants, banks & hotels near Peakolam Suites, Camp, Abeokuta',
    'Transit corridors along FUNAAB / Alabata Road toward Dayo Sanyaolu Junction',
    'Nearest transport hubs from Lagos or Ibadan to Camp, Abeokuta',
  ],
  abuja: [
    'Key commercial and financial districts in Abuja FCT',
    'Business hotels & transit hubs in Wuse II and Central Business District, Abuja',
  ],
};

function renderFormattedInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={idx} className="font-semibold text-[#F0D58A]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function renderGroundedProse(text: string): React.ReactNode {
  const lines = text.split(/\r?\n/);
  const blocks: React.ReactNode[] = [];
  let bulletBuffer: string[] = [];

  const flushBullets = (keyPrefix: string) => {
    if (bulletBuffer.length === 0) return;
    blocks.push(
      <ul key={keyPrefix} className="space-y-1.5 pl-4 list-disc marker:text-[#C9A24B]">
        {bulletBuffer.map((item, i) => (
          <li key={i} className="text-xs sm:text-sm leading-relaxed text-[#DDD6C7]">
            {renderFormattedInline(item)}
          </li>
        ))}
      </ul>
    );
    bulletBuffer = [];
  };

  lines.forEach((rawLine, idx) => {
    const trimmed = rawLine.trim();
    if (!trimmed) {
      flushBullets(`bullets-${idx}`);
      return;
    }
    if (/^[-*•]\s+/.test(trimmed)) {
      bulletBuffer.push(trimmed.replace(/^[-*•]\s+/, ''));
      return;
    }
    flushBullets(`bullets-before-${idx}`);
    blocks.push(
      <p key={`p-${idx}`} className="text-xs sm:text-sm leading-relaxed text-[#DDD6C7]">
        {renderFormattedInline(trimmed)}
      </p>
    );
  });

  flushBullets('bullets-end');
  return <div className="space-y-2">{blocks}</div>;
}

const MapsGroundingIntelligencePanel: React.FC<{ activeBranch: BranchId }> = ({
  activeBranch,
}) => {
  const branch = BRANCHES[activeBranch];
  const [question, setQuestion] = useState('');
  const [useGpsContext, setUseGpsContext] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [gpsStatus, setGpsStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    query: string;
    text: string;
    sources: MapsGroundingSource[];
  } | null>(null);

  useEffect(() => {
    setResult(null);
    setError(null);
  }, [activeBranch]);

  const handleToggleGps = (checked: boolean) => {
    setUseGpsContext(checked);
    setError(null);
    if (!checked) {
      setGpsCoords(null);
      setGpsStatus('');
      return;
    }
    if (!navigator.geolocation) {
      setUseGpsContext(false);
      setGpsStatus('GPS geolocation is unavailable in this browser.');
      return;
    }
    setGpsStatus('Reading device coordinates…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setGpsStatus(
          `GPS active (${pos.coords.latitude.toFixed(3)}, ${pos.coords.longitude.toFixed(3)})`
        );
      },
      () => {
        setUseGpsContext(false);
        setGpsCoords(null);
        setGpsStatus('GPS permission declined — answering from branch coordinates.');
      },
      { enableHighAccuracy: false, timeout: 8000 }
    );
  };

  const runGroundingQuery = useCallback(
    async (rawQuery: string) => {
      const trimmed = rawQuery.trim();
      if (!trimmed || loading) return;

      setQuestion(trimmed);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/maps/grounding', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: trimmed,
            branch: activeBranch,
            latLng: useGpsContext && gpsCoords ? gpsCoords : undefined,
          }),
        });

        const data = (await res.json()) as {
          text?: string;
          sources?: MapsGroundingSource[];
          error?: string;
        };

        if (!res.ok) {
          throw new Error(data.error || 'Unable to query Google Maps intelligence.');
        }

        setResult({
          query: trimmed,
          text: data.text?.trim() || 'No summary returned for this area query.',
          sources: Array.isArray(data.sources) ? data.sources : [],
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Could not fetch Google Maps grounded insights.'
        );
      } finally {
        setLoading(false);
      }
    },
    [activeBranch, gpsCoords, loading, useGpsContext]
  );

  const quickPrompts = GROUNDING_QUICK_PROMPTS[activeBranch];

  return (
    <div className="rounded-2xl border border-[#C9A24B]/26 bg-[#0B0B0D] p-5 sm:p-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#34D399]">
            <Globe className="h-3.5 w-3.5" />
            Area &amp; Landmark Intelligence · Grounded with Google Maps
          </div>
          <h4 className="mt-1 font-display text-lg sm:text-xl font-bold text-[#EDE6D6]">
            Ask About Amenities, Hotels &amp; Approach Corridors ({branch.shortName})
          </h4>
        </div>

        <label className="inline-flex cursor-pointer items-center gap-2 self-start rounded-lg border border-[#C9A24B]/24 bg-[#121215] px-3 py-1.5 text-[11px] text-[#EDE6D6]">
          <input
            type="checkbox"
            checked={useGpsContext}
            onChange={(e) => handleToggleGps(e.target.checked)}
            className="h-3.5 w-3.5 accent-[#34D399]"
          />
          <span>Use My GPS Context</span>
        </label>
      </div>

      {gpsStatus && (
        <p className="font-mono text-[11px] text-[#9A968C]">{gpsStatus}</p>
      )}

      {/* Quick Prompts */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            disabled={loading}
            onClick={() => void runGroundingQuery(prompt)}
            className="rounded-lg border border-[#C9A24B]/24 bg-[#141416] px-3 py-1.5 text-left text-xs text-[#EDE6D6]/90 hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors disabled:opacity-50"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Question Input + Voice Dictation */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void runGroundingQuery(question);
        }}
        className="flex items-center gap-2"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A24B]" />
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={`Ask about places, banks, lodging, or routes near ${branch.shortName}…`}
            aria-label="Ask Google Maps grounded area question"
            className="h-11 w-full rounded-xl border border-[#C9A24B]/28 bg-[#050507] pl-9 pr-3 text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/60 focus:border-[#F0D58A] focus:outline-none"
          />
        </div>
        <VoiceTranscribeButton
          compact
          label="Voice Ask"
          disabled={loading}
          onTranscript={(text) => {
            setQuestion(text);
            void runGroundingQuery(text);
          }}
          onError={(msg) => setError(msg)}
          className="h-11 w-11 shrink-0 rounded-xl"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#F0D58A] px-4 text-xs font-bold text-[#050507] transition-opacity hover:opacity-90 disabled:opacity-45"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          <span className="hidden sm:inline">Ask Maps</span>
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 p-3 text-xs text-[#FCA5A5]">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2.5 rounded-xl border border-[#C9A24B]/22 bg-[#121215] p-4 text-xs text-[#EDE6D6]">
          <Loader2 className="h-4 w-4 animate-spin text-[#F0D58A]" />
          Consulting live Google Maps place data for {branch.shortName}…
        </div>
      )}

      {result && !loading && (
        <div className="rounded-xl border border-[#C9A24B]/25 bg-[#101116] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-[#C9A24B]/15 pb-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#F0D58A]">
              Maps Grounded Briefing
            </span>
            <span className="font-mono text-[10px] text-[#9A968C]">
              Google Maps Grounding
            </span>
          </div>

          {renderGroundedProse(result.text)}

          {result.sources.length > 0 && (
            <div className="space-y-2 border-t border-[#C9A24B]/15 pt-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-[#34D399]">
                Verified Google Maps Places &amp; Links ({result.sources.length})
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {result.sources.map((src) => (
                  <a
                    key={src.uri}
                    href={src.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-2 rounded-lg border border-[#C9A24B]/24 bg-[#07080B] px-3 py-2 text-xs font-medium text-[#EDE6D6] hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
                  >
                    <span className="truncate">{src.title}</span>
                    <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#C9A24B]" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const BRANCHES: Record<BranchId, BranchSpec> = {
  abeokuta: {
    id: 'abeokuta',
    badge: 'Flagship Branch · Ogun State',
    title: 'Bullish Titan · Timeline Bazaar',
    shortName: 'Abeokuta Flagship',
    cityLabel: 'Abeokuta, Ogun State',
    address: 'Timeline Bazaar, Dayo Sanyaolu Junction, Camp, Abeokuta, Ogun State, Nigeria.',
    landmark: 'Beside Peakolam Restaurant / Peakolam Suites, along the FUNAAB Road (Alabata Road) axis.',
    axisNote:
      'Located right off Dayo Sanyaolu Junction in the Camp corridor on the way toward FUNAAB / Alabata Road, directly beside Peakolam Restaurant & Suites.',
    status: 'registered',
    statusLabel: 'Registered on Google Maps',
    searchQueries: [
      'Bullish Titan Timeline Bazaar Camp Abeokuta',
      'Timeline Bazaar Dayo Sanyaolu Junction Camp Abeokuta',
      'Peakolam Suites Camp Abeokuta Ogun State Nigeria',
      'Camp Abeokuta Ogun State Nigeria',
    ],
    directMapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Bullish+Titan+Timeline+Bazaar+Dayo+Sanyaolu+Junction+Camp+Abeokuta+Ogun+State+Nigeria',
    defaultZoom: 15,
  },
  abuja: {
    id: 'abuja',
    badge: 'Regional Branch · FCT',
    title: 'Bullish Titan · Abuja Branch',
    shortName: 'Abuja Branch',
    cityLabel: 'Abuja, Federal Capital Territory',
    address: 'Abuja, Nigeria — Exact street address not yet specified.',
    landmark: 'FCT Regional Desk · Suite & Street Coordinates Coming Soon.',
    axisNote:
      'Our Abuja regional presence is active via remote desk briefings while the physical FCT suite address is finalized.',
    status: 'tba',
    statusLabel: 'Address Not Yet Specified',
    searchQueries: ['Abuja Federal Capital Territory Nigeria'],
    directMapsSearchUrl:
      'https://www.google.com/maps/search/?api=1&query=Abuja+Federal+Capital+Territory+Nigeria',
    defaultZoom: 11,
  },
};

const QUICK_ORIGIN_LANDMARKS: Array<{ label: string; query: string }> = [
  { label: 'FUNAAB Main Gate', query: 'FUNAAB Main Gate Alabata Road Abeokuta Nigeria' },
  { label: 'Panseke, Abeokuta', query: 'Panseke Abeokuta Ogun State Nigeria' },
  { label: 'Kuto Motor Park', query: 'Kuto Motor Park Abeokuta Ogun State Nigeria' },
  { label: 'Abeokuta Train Station', query: 'Professor Wole Soyinka Train Station Laderin Abeokuta Nigeria' },
  { label: 'Murtala Muhammed Airport, Lagos', query: 'Murtala Muhammed International Airport Lagos Nigeria' },
];

const TRAVEL_MODES: Array<{
  key: TravelModeKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: 'DRIVING', label: 'Drive', icon: Car },
  { key: 'TWO_WHEELER', label: 'Bike / Okada', icon: Bike },
  { key: 'TRANSIT', label: 'Transit', icon: Bus },
  { key: 'WALKING', label: 'Walk', icon: Footprints },
];

const COUNTRY_WIDE_FALLBACK_CENTER: google.maps.LatLngLiteral = { lat: 9.082, lng: 8.6753 };

function reportQuotaIfApplicable(err: unknown) {
  const msg = err instanceof Error ? err.message : String(err ?? '');
  if (
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('OVER_QUERY_LIMIT') ||
    msg.includes('OverQuotaMapError') ||
    msg.includes('QuotaExceededError') ||
    msg.includes('429')
  ) {
    window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
  }
}

function toLatLngLiteral(loc: google.maps.LatLng | google.maps.LatLngLiteral): google.maps.LatLngLiteral {
  if (typeof (loc as google.maps.LatLng).lat === 'function') {
    const ll = loc as google.maps.LatLng;
    return { lat: ll.lat(), lng: ll.lng() };
  }
  return loc as google.maps.LatLngLiteral;
}

function formatDistance(meters: number): string {
  if (!Number.isFinite(meters) || meters <= 0) return '—';
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

function formatDuration(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return '—';
  const totalMins = Math.max(1, Math.round(ms / 60000));
  if (totalMins < 60) return `${totalMins} min`;
  const hrs = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  return mins > 0 ? `${hrs} hr ${mins} min` : `${hrs} hr`;
}

function buildGoogleDirectionsUrl(
  dest: ResolvedPlace | null,
  branch: BranchSpec,
  origin: ResolvedPlace | null,
  travelMode: TravelModeKey
): string {
  const params = new URLSearchParams({ api: '1' });
  if (dest) {
    params.set('destination', `${dest.location.lat},${dest.location.lng}`);
    if (dest.id && branch.status === 'registered') {
      params.set('destination_place_id', dest.id);
    }
  } else {
    params.set('destination', branch.address);
  }
  if (origin) {
    params.set('origin', `${origin.location.lat},${origin.location.lng}`);
  }
  const modeMap: Record<TravelModeKey, string> = {
    DRIVING: 'driving',
    TWO_WHEELER: 'two-wheeler',
    TRANSIT: 'transit',
    WALKING: 'walking',
  };
  params.set('travelmode', modeMap[travelMode] ?? 'driving');
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

interface InnerProps {
  activeBranch: BranchId;
  onSelectBranch: (id: BranchId) => void;
}

const LocationIntelligenceWorkspace: React.FC<InnerProps> = ({
  activeBranch,
  onSelectBranch,
}) => {
  const map = useMap();
  const placesLib = useMapsLibrary('places');
  const routesLib = useMapsLibrary('routes');

  const branch = BRANCHES[activeBranch];
  const [branchPlace, setBranchPlace] = useState<ResolvedPlace | null>(null);
  const [resolvingBranch, setResolvingBranch] = useState(false);
  const [branchLookupNote, setBranchLookupNote] = useState<string>('');

  const [nearbyLandmarks, setNearbyLandmarks] = useState<NearbyLandmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<NearbyLandmark | null>(null);
  const [showBranchInfo, setShowBranchInfo] = useState(true);

  const [originInput, setOriginInput] = useState('');
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [originPlace, setOriginPlace] = useState<ResolvedPlace | null>(null);
  const [travelMode, setTravelMode] = useState<TravelModeKey>('DRIVING');
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const [branchMarkerRef, branchMarker] = useAdvancedMarkerRef();
  const [landmarkMarkerRef, landmarkMarker] = useAdvancedMarkerRef();

  // Resolve branch coordinate & place details live via Places API (New) — zero hardcoded lat/lng
  useEffect(() => {
    if (!placesLib) return;
    let cancelled = false;

    async function resolveSelectedBranch() {
      setResolvingBranch(true);
      setBranchLookupNote('');
      setNearbyLandmarks([]);
      setSelectedLandmark(null);
      setRouteSummary(null);
      setRouteError(null);

      try {
        const { Place } = placesLib!;
        let resolved: ResolvedPlace | null = null;
        let matchedQuery = '';

        for (const query of branch.searchQueries) {
          try {
            const { places } = await Place.searchByText({
              textQuery: query,
              fields: [
                'id',
                'displayName',
                'formattedAddress',
                'location',
                'viewport',
                'googleMapsURI',
                'primaryTypeDisplayName',
              ],
              includedType: undefined,
              maxResultCount: 1,
              region: 'ng',
            });

            const candidate = places?.[0];
            if (candidate?.location) {
              resolved = {
                id: candidate.id,
                displayName: candidate.displayName || branch.title,
                formattedAddress: candidate.formattedAddress || branch.address,
                location: toLatLngLiteral(candidate.location),
                viewport: candidate.viewport ?? null,
                googleMapsURI: candidate.googleMapsURI ?? branch.directMapsSearchUrl,
                primaryType: candidate.primaryTypeDisplayName ?? null,
              };
              matchedQuery = query;
              break;
            }
          } catch (innerErr) {
            reportQuotaIfApplicable(innerErr);
          }
        }

        if (cancelled) return;

        if (resolved) {
          setBranchPlace(resolved);
          setShowBranchInfo(true);
          if (
            branch.id === 'abeokuta' &&
            matchedQuery &&
            !matchedQuery.toLowerCase().includes('bullish titan')
          ) {
            setBranchLookupNote(
              `Centered on verified nearby corridor pin (${resolved.displayName}) beside Peakolam Restaurant / Suites.`
            );
          }

          if (map) {
            if (resolved.viewport && branch.id === 'abuja') {
              map.fitBounds(resolved.viewport);
            } else {
              map.panTo(resolved.location);
              map.setZoom(branch.defaultZoom);
            }
          }

          // Fetch real nearby reference landmarks for orientation around registered Abeokuta branch
          if (branch.id === 'abeokuta') {
            try {
              const { places: nearby } = await Place.searchNearby({
                fields: [
                  'id',
                  'displayName',
                  'formattedAddress',
                  'location',
                  'primaryTypeDisplayName',
                  'googleMapsURI',
                ],
                locationRestriction: {
                  center: resolved.location,
                  radius: 1600,
                },
                includedPrimaryTypes: [
                  'restaurant',
                  'hotel',
                  'lodging',
                  'university',
                  'bank',
                  'shopping_mall',
                  'gas_station',
                ],
                maxResultCount: 6,
                rankPreference: placesLib!.SearchNearbyRankPreference.DISTANCE,
              });

              if (!cancelled && nearby?.length) {
                const mapped: NearbyLandmark[] = nearby
                  .filter((p) => p.location && p.id !== resolved?.id)
                  .slice(0, 6)
                  .map((p) => ({
                    id: p.id,
                    displayName: p.displayName || 'Reference Landmark',
                    formattedAddress: p.formattedAddress || 'Camp / FUNAAB Road Axis, Abeokuta',
                    location: toLatLngLiteral(p.location!),
                    primaryType: p.primaryTypeDisplayName || 'Landmark',
                    googleMapsURI: p.googleMapsURI ?? null,
                  }));
                setNearbyLandmarks(mapped);
              }
            } catch (nearbyErr) {
              reportQuotaIfApplicable(nearbyErr);
            }
          }
        }
      } catch (err) {
        reportQuotaIfApplicable(err);
        if (!cancelled) {
          setBranchLookupNote('Live map lookup encountered an error. Use direct Google Maps links below.');
        }
      } finally {
        if (!cancelled) setResolvingBranch(false);
      }
    }

    void resolveSelectedBranch();
    return () => {
      cancelled = true;
    };
  }, [placesLib, map, branch]);

  // Autocomplete Suggestions for visitor starting address (debounced + session token)
  useEffect(() => {
    if (!placesLib) return;
    const trimmed = originInput.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }

    let cancelled = false;
    setLoadingSuggestions(true);

    const timer = window.setTimeout(async () => {
      try {
        const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;
        if (!sessionTokenRef.current) {
          sessionTokenRef.current = new AutocompleteSessionToken();
        }
        const request: google.maps.places.AutocompleteRequest = {
          input: trimmed,
          sessionToken: sessionTokenRef.current,
          includedRegionCodes: ['ng'],
          locationBias: branchPlace?.location
            ? { center: branchPlace.location, radius: 45000 }
            : undefined,
        };
        const res = await AutocompleteSuggestion.fetchAutocompleteSuggestions(request);
        if (!cancelled) {
          setSuggestions(res.suggestions.slice(0, 5));
        }
      } catch (err) {
        reportQuotaIfApplicable(err);
        if (!cancelled) setSuggestions([]);
      } finally {
        if (!cancelled) setLoadingSuggestions(false);
      }
    }, 220);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [placesLib, originInput, branchPlace?.location]);

  const resetAutocompleteSession = useCallback(() => {
    sessionTokenRef.current = null;
    setSuggestions([]);
  }, []);

  const handleSelectSuggestion = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;
      try {
        const place = suggestion.placePrediction.toPlace();
        await place.fetchFields({
          fields: ['id', 'displayName', 'formattedAddress', 'location', 'viewport'],
        });
        resetAutocompleteSession();
        if (place.location) {
          const label = place.displayName || suggestion.placePrediction.text.text;
          setOriginInput(label);
          setOriginPlace({
            id: place.id,
            displayName: label,
            formattedAddress: place.formattedAddress || label,
            location: toLatLngLiteral(place.location),
            viewport: place.viewport ?? null,
          });
        }
      } catch (err) {
        reportQuotaIfApplicable(err);
        setRouteError('Could not load details for that starting point.');
      }
    },
    [placesLib, resetAutocompleteSession]
  );

  const handleQuickOrigin = useCallback(
    async (landmark: { label: string; query: string }) => {
      if (!placesLib) return;
      setRouteError(null);
      setRouteLoading(true);
      try {
        const { places } = await placesLib.Place.searchByText({
          textQuery: landmark.query,
          fields: ['id', 'displayName', 'formattedAddress', 'location'],
          maxResultCount: 1,
          region: 'ng',
        });
        const match = places?.[0];
        if (match?.location) {
          setOriginInput(landmark.label);
          setSuggestions([]);
          setOriginPlace({
            id: match.id,
            displayName: match.displayName || landmark.label,
            formattedAddress: match.formattedAddress || landmark.query,
            location: toLatLngLiteral(match.location),
          });
        } else {
          setRouteError(`Could not pinpoint "${landmark.label}" on the map.`);
          setRouteLoading(false);
        }
      } catch (err) {
        reportQuotaIfApplicable(err);
        setRouteError('Unable to locate that landmark right now.');
        setRouteLoading(false);
      }
    },
    [placesLib]
  );

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setRouteError('Browser GPS geolocation is unavailable on this device.');
      return;
    }
    setGpsLoading(true);
    setRouteError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoading(false);
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setOriginInput('My Current GPS Location');
        setSuggestions([]);
        setOriginPlace({
          id: 'gps-current',
          displayName: 'Your Current GPS Position',
          formattedAddress: `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          location: coords,
        });
      },
      (geoErr) => {
        setGpsLoading(false);
        setRouteError(
          geoErr.code === 1
            ? 'Location permission was declined. Type any landmark or city above instead.'
            : 'Unable to read GPS signal. Try selecting a nearby landmark above.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  // Compute live route polyline + distance + ETA via Routes API JS SDK
  useEffect(() => {
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    if (!routesLib || !map || !originPlace || !branchPlace) {
      setRouteSummary(null);
      return;
    }

    let cancelled = false;
    setRouteLoading(true);
    setRouteError(null);

    const request = {
      origin: originPlace.location,
      destination: branchPlace.location,
      travelMode,
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport', 'legs'],
    };

    (routesLib.Route as any)
      .computeRoutes(request)
      .then(({ routes }: { routes?: any[] }) => {
        if (cancelled) return;
        setRouteLoading(false);

        if (!routes || routes.length === 0) {
          setRouteSummary(null);
          setRouteError(
            travelMode === 'TRANSIT'
              ? 'Public transit routing is limited on this corridor. Try Drive or Bike mode.'
              : 'No drivable route returned between those two points.'
          );
          return;
        }

        const primaryRoute = routes[0];
        if (typeof primaryRoute.createPolylines === 'function') {
          const newPolylines: google.maps.Polyline[] = primaryRoute.createPolylines();
          newPolylines.forEach((polyline) => {
            polyline.setOptions({
              strokeColor: '#F0D58A',
              strokeOpacity: 0.94,
              strokeWeight: 5,
            });
            polyline.setMap(map);
          });
          polylinesRef.current = newPolylines;
        }

        if (primaryRoute.viewport) {
          map.fitBounds(primaryRoute.viewport, 48);
        }

        const firstInstructionRaw =
          primaryRoute.legs?.[0]?.steps?.[0]?.navigationInstruction?.instructions;

        setRouteSummary({
          distanceMeters: primaryRoute.distanceMeters ?? 0,
          durationMillis: primaryRoute.durationMillis ?? 0,
          firstInstruction:
            typeof firstInstructionRaw === 'string' && firstInstructionRaw.trim()
              ? firstInstructionRaw.trim()
              : undefined,
          mode: travelMode,
          originLabel: originPlace.displayName,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setRouteLoading(false);
        setRouteSummary(null);
        reportQuotaIfApplicable(err);
        setRouteError(
          travelMode === 'TRANSIT'
            ? 'Public transit schedules are unavailable for this corridor. Switch to Drive or Bike.'
            : 'Unable to compute route right now. Use "Open Directions in Google Maps".'
        );
      });

    return () => {
      cancelled = true;
      polylinesRef.current.forEach((p) => p.setMap(null));
      polylinesRef.current = [];
    };
  }, [routesLib, map, originPlace, branchPlace, travelMode]);

  const handleClearRoute = () => {
    setOriginPlace(null);
    setOriginInput('');
    setRouteSummary(null);
    setRouteError(null);
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];
    if (map && branchPlace) {
      map.panTo(branchPlace.location);
      map.setZoom(branch.defaultZoom);
    }
  };

  const handleCopyAddress = async () => {
    const text = `${branch.title}\n${branch.address}\nLandmark: ${branch.landmark}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(true);
      window.setTimeout(() => setCopiedAddress(false), 2000);
    } catch {
      // Clipboard blocked in some embedded contexts; silent fallback
    }
  };

  const directionsHref = useMemo(
    () => buildGoogleDirectionsUrl(branchPlace, branch, originPlace, travelMode),
    [branchPlace, branch, originPlace, travelMode]
  );

  const openMapsHref = branchPlace?.googleMapsURI || branch.directMapsSearchUrl;

  return (
    <div className="space-y-6">
      {/* Branch Switcher Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-md border border-[#C9A24B]/35 bg-[#C9A24B]/10 px-2.5 py-1 text-[11px] font-mono uppercase tracking-[0.16em] text-[#F0D58A]">
            <Compass className="h-3.5 w-3.5" />
            Branch Locator &amp; Route Intelligence
          </div>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-[#EDE6D6]">
            Visit Bullish Titan in Nigeria
          </h3>
          <p className="mt-1 text-sm text-[#9A968C]">
            Connect directly to Google Maps, calculate live travel time from your location or any Nigerian landmark, and inspect verified Camp / FUNAAB Road reference points.
          </p>
        </div>

        {/* Two-Branch Toggle */}
        <div
          role="tablist"
          aria-label="Bullish Titan Branch Locations"
          className="inline-flex shrink-0 rounded-xl border border-[#C9A24B]/28 bg-[#0A0A0C] p-1"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeBranch === 'abeokuta'}
            onClick={() => onSelectBranch('abeokuta')}
            className={`rounded-lg px-4 py-2 text-left transition-all ${
              activeBranch === 'abeokuta'
                ? 'bg-gradient-to-r from-[#C9A24B] to-[#F0D58A] text-[#050507] shadow-sm'
                : 'text-[#EDE6D6]/80 hover:text-[#F0D58A]'
            }`}
          >
            <span className="block text-xs font-bold">Abeokuta Flagship</span>
            <span
              className={`block font-mono text-[10px] ${
                activeBranch === 'abeokuta' ? 'text-[#050507]/80' : 'text-[#34D399]'
              }`}
            >
              Timeline Bazaar · Live on Maps
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeBranch === 'abuja'}
            onClick={() => onSelectBranch('abuja')}
            className={`rounded-lg px-4 py-2 text-left transition-all ${
              activeBranch === 'abuja'
                ? 'bg-gradient-to-r from-[#C9A24B] to-[#F0D58A] text-[#050507] shadow-sm'
                : 'text-[#EDE6D6]/80 hover:text-[#F0D58A]'
            }`}
          >
            <span className="block text-xs font-bold">Abuja Branch</span>
            <span
              className={`block font-mono text-[10px] ${
                activeBranch === 'abuja' ? 'text-[#050507]/80' : 'text-[#9A968C]'
              }`}
            >
              Address Not Yet Specified
            </span>
          </button>
        </div>
      </div>

      {/* Main Intelligence Grid: Map Canvas + Route Intelligence Panel */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left: Interactive Google Map + Selected Branch Card */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative h-[380px] sm:h-[440px] w-full overflow-hidden rounded-2xl border border-[#C9A24B]/30 bg-[#08090C] shadow-[0_18px_50px_rgba(0,0,0,0.65)]">
            <GoogleMap
              mapId="DEMO_MAP_ID"
              defaultCenter={COUNTRY_WIDE_FALLBACK_CENTER}
              defaultZoom={branch.defaultZoom}
              gestureHandling="greedy"
              streetViewControl={true}
              mapTypeControl={false}
              fullscreenControl={true}
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              className="h-full w-full"
            >
              {branchPlace && (
                <>
                  <AdvancedMarker
                    ref={branchMarkerRef}
                    position={branchPlace.location}
                    title={branch.title}
                    onClick={() => {
                      setSelectedLandmark(null);
                      setShowBranchInfo(true);
                    }}
                  >
                    <Pin
                      background={branch.status === 'registered' ? '#F0D58A' : '#64748B'}
                      borderColor="#07090E"
                      glyphColor="#07090E"
                      scale={1.25}
                    />
                  </AdvancedMarker>

                  {showBranchInfo && branchMarker && (
                    <InfoWindow
                      anchor={branchMarker}
                      maxWidth={280}
                      onCloseClick={() => setShowBranchInfo(false)}
                    >
                      <div className="space-y-1.5 p-1 text-[#0B0D12]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-xs tracking-tight">{branch.title}</span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                              branch.status === 'registered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {branch.status === 'registered' ? 'Verified Pin' : 'Address TBA'}
                          </span>
                        </div>
                        <p className="text-[11px] leading-snug text-slate-700">{branch.address}</p>
                        <p className="text-[11px] font-medium text-amber-800">{branch.landmark}</p>
                        <div className="pt-1 flex items-center gap-3">
                          <a
                            href={openMapsHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[11px] font-semibold text-blue-700 underline"
                          >
                            Open in Google Maps
                          </a>
                          {branch.status === 'registered' && (
                            <a
                              href={directionsHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-semibold text-emerald-700 underline"
                            >
                              Directions
                            </a>
                          )}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </>
              )}

              {originPlace && (
                <AdvancedMarker
                  position={originPlace.location}
                  title={`Start: ${originPlace.displayName}`}
                >
                  <Pin
                    background="#10B981"
                    borderColor="#064E3B"
                    glyphColor="#FFFFFF"
                    scale={1.1}
                  />
                </AdvancedMarker>
              )}

              {nearbyLandmarks.map((lm) => (
                <AdvancedMarker
                  key={lm.id}
                  ref={selectedLandmark?.id === lm.id ? landmarkMarkerRef : undefined}
                  position={lm.location}
                  title={lm.displayName}
                  onClick={() => {
                    setShowBranchInfo(false);
                    setSelectedLandmark(lm);
                  }}
                >
                  <Pin
                    background="#1E293B"
                    borderColor="#C9A24B"
                    glyphColor="#F0D58A"
                    scale={0.88}
                  />
                </AdvancedMarker>
              ))}

              {selectedLandmark && landmarkMarker && (
                <InfoWindow
                  anchor={landmarkMarker}
                  maxWidth={240}
                  onCloseClick={() => setSelectedLandmark(null)}
                >
                  <div className="space-y-1 p-1 text-[#0B0D12]">
                    <p className="text-xs font-bold">{selectedLandmark.displayName}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500">
                      {selectedLandmark.primaryType}
                    </p>
                    <p className="text-[11px] text-slate-700">{selectedLandmark.formattedAddress}</p>
                    {selectedLandmark.googleMapsURI && (
                      <a
                        href={selectedLandmark.googleMapsURI}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block pt-0.5 text-[11px] font-semibold text-blue-700 underline"
                      >
                        View Landmark on Google Maps
                      </a>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Floating Top-Left Live Pin Status Badge */}
            <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-2 rounded-lg border border-[#C9A24B]/35 bg-[#07090E]/88 px-3 py-1.5 backdrop-blur-md">
              {resolvingBranch ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-[#F0D58A]" />
                  <span className="font-mono text-[11px] text-[#EDE6D6]">
                    Resolving Google Maps coordinates…
                  </span>
                </>
              ) : (
                <>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      branch.status === 'registered' ? 'bg-[#34D399]' : 'bg-[#F0D58A]'
                    }`}
                  />
                  <span className="font-mono text-[11px] text-[#EDE6D6]">
                    {branch.shortName} · {branch.statusLabel}
                  </span>
                </>
              )}
            </div>
          </div>

          {branchLookupNote && (
            <p className="text-xs text-[#9A968C] font-mono">{branchLookupNote}</p>
          )}

          {/* Selected Branch Address & Direct Google Maps Actions */}
          <div className="rounded-2xl border border-[#C9A24B]/24 bg-[#0B0B0D] p-5 space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C9A24B]">
                  {branch.badge}
                </p>
                <h4 className="font-display text-xl font-bold text-[#EDE6D6]">{branch.title}</h4>
              </div>
              <span
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold ${
                  branch.status === 'registered'
                    ? 'border-[#34D399]/35 bg-[#10B981]/12 text-[#34D399]'
                    : 'border-[#C9A24B]/35 bg-[#C9A24B]/12 text-[#F0D58A]'
                }`}
              >
                {branch.statusLabel}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2.5 text-[#EDE6D6]">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#F0D58A]" />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-start gap-2.5 text-[#9A968C]">
                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
                <span>
                  <strong className="text-[#EDE6D6]">Landmark:</strong> {branch.landmark}
                </span>
              </div>
              <p className="pl-6 text-xs leading-relaxed text-[#9A968C]">{branch.axisNote}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#C9A24B]/15">
              <a
                href={openMapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A24B] to-[#F0D58A] px-4 py-2 text-xs font-bold text-[#050507] transition-opacity hover:opacity-90"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Google Maps
              </a>

              {branch.status === 'registered' && (
                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-[#34D399]/40 bg-[#10B981]/10 px-4 py-2 text-xs font-semibold text-[#34D399] transition-colors hover:bg-[#10B981]/20"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Get Turn-by-Turn Directions
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyAddress}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A24B]/28 bg-[#141416] px-3.5 py-2 text-xs font-medium text-[#EDE6D6] hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
              >
                {copiedAddress ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-[#34D399]" />
                    Address Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-[#C9A24B]" />
                    Copy Full Address
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Location Intelligence & Route Planner */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-[#C9A24B]/26 bg-[#0B0B0D] p-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#F0D58A]" />
                <h4 className="font-display text-lg font-bold text-[#EDE6D6]">
                  Smart Route &amp; ETA Planner
                </h4>
              </div>
              {originPlace && (
                <button
                  type="button"
                  onClick={handleClearRoute}
                  className="text-[11px] font-mono text-[#9A968C] hover:text-[#F0D58A] underline"
                >
                  Reset Route
                </button>
              )}
            </div>

            <p className="text-xs text-[#9A968C]">
              Type where you are coming from (e.g., Lagos, Panseke, FUNAAB Gate, Ibadan) or tap a quick landmark to preview live distance and arrival time to{' '}
              <span className="text-[#EDE6D6] font-medium">{branch.shortName}</span>.
            </p>

            {/* Autocomplete Input + GPS Button */}
            <div className="space-y-2.5">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#C9A24B]" />
                <input
                  type="text"
                  value={originInput}
                  onChange={(e) => {
                    setOriginInput(e.target.value);
                    if (!e.target.value.trim()) setOriginPlace(null);
                  }}
                  placeholder="Enter starting street, bus stop, or city…"
                  aria-label="Starting location for directions"
                  className="h-11 w-full rounded-xl border border-[#C9A24B]/28 bg-[#050507] pl-9 pr-9 text-sm text-[#EDE6D6] placeholder:text-[#9A968C]/60 focus:border-[#F0D58A] focus:outline-none"
                />
                {loadingSuggestions && (
                  <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-[#F0D58A]" />
                )}

                {suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 top-12 z-20 max-h-56 overflow-y-auto rounded-xl border border-[#C9A24B]/35 bg-[#090A0E] p-1 shadow-2xl">
                    {suggestions.map((s, idx) => {
                      const label = s.placePrediction?.text.text ?? '';
                      if (!label) return null;
                      return (
                        <li key={`${label}-${idx}`}>
                          <button
                            type="button"
                            onClick={() => void handleSelectSuggestion(s)}
                            className="flex w-full items-start gap-2 rounded-lg px-3 py-2 text-left text-xs text-[#EDE6D6] hover:bg-[#C9A24B]/15 hover:text-[#F0D58A] transition-colors"
                          >
                            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A24B]" />
                            <span>{label}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={gpsLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#34D399]/35 bg-[#10B981]/10 py-2.5 text-xs font-semibold text-[#34D399] hover:bg-[#10B981]/18 transition-colors disabled:opacity-60"
              >
                {gpsLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Crosshair className="h-3.5 w-3.5" />
                )}
                Use My Current GPS Location
              </button>
            </div>

            {/* Quick Starting Points */}
            <div className="space-y-1.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#9A968C]">
                Common Approach Corridors
              </p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_ORIGIN_LANDMARKS.map((lm) => (
                  <button
                    key={lm.label}
                    type="button"
                    onClick={() => void handleQuickOrigin(lm)}
                    className="rounded-md border border-[#C9A24B]/24 bg-[#141416] px-2.5 py-1 text-[11px] font-medium text-[#EDE6D6]/90 hover:border-[#F0D58A] hover:text-[#F0D58A] transition-colors"
                  >
                    {lm.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Mode Switcher */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {TRAVEL_MODES.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTravelMode(key)}
                  className={`flex flex-col items-center justify-center gap-1 rounded-lg border py-2 text-[11px] font-medium transition-colors ${
                    travelMode === key
                      ? 'border-[#F0D58A] bg-[#C9A24B]/18 text-[#F0D58A]'
                      : 'border-[#C9A24B]/18 bg-[#121214] text-[#9A968C] hover:text-[#EDE6D6]'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Live Route Summary Result */}
            {routeLoading && (
              <div className="flex items-center gap-2.5 rounded-xl border border-[#C9A24B]/25 bg-[#121215] p-3.5 text-xs text-[#EDE6D6]">
                <Loader2 className="h-4 w-4 animate-spin text-[#F0D58A]" />
                Calculating live route and travel time…
              </div>
            )}

            {routeError && (
              <div className="rounded-xl border border-[#EF4444]/35 bg-[#EF4444]/10 p-3 text-xs text-[#FCA5A5]">
                {routeError}
              </div>
            )}

            {routeSummary && !routeLoading && (
              <div className="rounded-xl border border-[#34D399]/35 bg-[#091612] p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#34D399]">
                    Live Route Details
                  </span>
                  <span className="font-mono text-[10px] text-[#9A968C]">
                    {routeSummary.originLabel} → {branch.shortName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-[#C9A24B]/20 bg-[#050507]/70 p-2.5">
                    <span className="block font-mono text-[10px] text-[#9A968C]">EST. TRAVEL TIME</span>
                    <span className="font-display text-xl font-bold text-[#F0D58A]">
                      {formatDuration(routeSummary.durationMillis)}
                    </span>
                  </div>
                  <div className="rounded-lg border border-[#C9A24B]/20 bg-[#050507]/70 p-2.5">
                    <span className="block font-mono text-[10px] text-[#9A968C]">DISTANCE</span>
                    <span className="font-display text-xl font-bold text-[#EDE6D6]">
                      {formatDistance(routeSummary.distanceMeters)}
                    </span>
                  </div>
                </div>

                {routeSummary.firstInstruction && (
                  <p className="text-xs text-[#C8C2B6] leading-relaxed">
                    <strong className="text-[#F0D58A]">First leg:</strong>{' '}
                    {routeSummary.firstInstruction}
                  </p>
                )}

                <a
                  href={directionsHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#34D399] px-3 py-2 text-xs font-bold text-[#050507] hover:bg-[#6EE7B7] transition-colors"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  Launch Navigation in Google Maps
                </a>
              </div>
            )}
          </div>

          {/* Nearby Reference Landmarks around Timeline Bazaar / Camp */}
          {branch.id === 'abeokuta' && (
            <div className="rounded-2xl border border-[#C9A24B]/22 bg-[#0B0B0D] p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C9A24B] font-semibold">
                  Nearby Camp / FUNAAB Axis Landmarks
                </p>
                <span className="font-mono text-[10px] text-[#9A968C]">Click to inspect on map</span>
              </div>

              {nearbyLandmarks.length === 0 ? (
                <p className="text-xs text-[#9A968C]">
                  Key Arrival Cue: Look out for Peakolam Restaurant / Peakolam Suites at Dayo Sanyaolu Junction, Camp along FUNAAB (Alabata) Road.
                </p>
              ) : (
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {nearbyLandmarks.map((lm) => {
                    const isActive = selectedLandmark?.id === lm.id;
                    return (
                      <button
                        key={lm.id}
                        type="button"
                        onClick={() => {
                          setShowBranchInfo(false);
                          setSelectedLandmark(lm);
                          map?.panTo(lm.location);
                        }}
                        className={`flex items-start justify-between gap-2 rounded-xl border px-3 py-2 text-left transition-colors ${
                          isActive
                            ? 'border-[#F0D58A] bg-[#C9A24B]/15'
                            : 'border-[#C9A24B]/16 bg-[#121215] hover:border-[#C9A24B]/45'
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-semibold text-[#EDE6D6]">
                            {lm.displayName}
                          </p>
                          <p className="truncate text-[11px] text-[#9A968C]">{lm.primaryType}</p>
                        </div>
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C9A24B]" />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {branch.id === 'abuja' && (
            <div className="rounded-2xl border border-[#C9A24B]/22 bg-[#0B0B0D] p-5 space-y-2">
              <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#F0D58A] font-semibold">
                Abuja Branch Status
              </p>
              <p className="text-xs leading-relaxed text-[#9A968C]">
                Our Abuja FCT office address has not yet been publicly specified. In the meantime, Abuja members can use our contact form or book 1-on-1 coaching sessions online, or visit our flagship Ogun State location at Timeline Bazaar, Camp, Abeokuta.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Dedicated Google Maps Grounding Panel */}
      <MapsGroundingIntelligencePanel activeBranch={activeBranch} />
    </div>
  );
};

export const TitanLocationIntelligence: React.FC = () => {
  const [activeBranch, setActiveBranch] = useState<BranchId>('abeokuta');
  const [apiKey, setApiKey] = useState<string>(() =>
    (import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '').trim()
  );
  const [keyLoading, setKeyLoading] = useState<boolean>(() => !import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  useEffect(() => {
    if (apiKey) {
      setKeyLoading(false);
      return;
    }

    let cancelled = false;
    fetch('/api/maps/config')
      .then((res) => (res.ok ? res.json() : { apiKey: '' }))
      .then((data: { apiKey?: string }) => {
        if (!cancelled && typeof data?.apiKey === 'string' && data.apiKey.trim()) {
          setApiKey(data.apiKey.trim());
        }
      })
      .catch(() => {
        // Ignore network error; fallback UI still presents exact address and Google Maps links
      })
      .finally(() => {
        if (!cancelled) setKeyLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [apiKey]);

  const selectedBranch = BRANCHES[activeBranch];

  if (keyLoading) {
    return (
      <div className="rounded-2xl border border-[#C9A24B]/24 bg-[#0B0B0D] p-8 flex items-center justify-center gap-3 text-sm text-[#EDE6D6]">
        <Loader2 className="h-5 w-5 animate-spin text-[#F0D58A]" />
        Initializing Bullish Titan Google Maps Intelligence…
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="rounded-2xl border border-[#C9A24B]/28 bg-[#0B0B0D] p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#C9A24B]">
              Branch Locations &amp; Direct Google Maps Links
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-[#EDE6D6]">
              Abeokuta Flagship &amp; Abuja Branch
            </h3>
          </div>
          <div className="inline-flex rounded-xl border border-[#C9A24B]/24 bg-[#050507] p-1">
            <button
              type="button"
              onClick={() => setActiveBranch('abeokuta')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                activeBranch === 'abeokuta'
                  ? 'bg-[#C9A24B] text-[#050507]'
                  : 'text-[#EDE6D6]/80'
              }`}
            >
              Abeokuta Flagship
            </button>
            <button
              type="button"
              onClick={() => setActiveBranch('abuja')}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                activeBranch === 'abuja' ? 'bg-[#C9A24B] text-[#050507]' : 'text-[#EDE6D6]/80'
              }`}
            >
              Abuja Branch (TBA)
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-[#C9A24B]/20 bg-[#121215] p-5 space-y-2.5">
          <p className="font-display text-lg font-bold text-[#EDE6D6]">{selectedBranch.title}</p>
          <p className="text-sm text-[#EDE6D6]">{selectedBranch.address}</p>
          <p className="text-xs text-[#9A968C]">
            <strong className="text-[#F0D58A]">Landmark:</strong> {selectedBranch.landmark}
          </p>
            <div className="pt-2">
            <a
              href={selectedBranch.directMapsSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#C9A24B] to-[#F0D58A] px-4 py-2 text-xs font-bold text-[#050507]"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
          </div>
        </div>

        <MapsGroundingIntelligencePanel activeBranch={activeBranch} />
      </div>
    );
  }

  return (
    <APIProvider
      apiKey={apiKey}
      language="en"
      region="NG"
      libraries={['places', 'routes', 'marker']}
    >
      <LocationIntelligenceWorkspace
        activeBranch={activeBranch}
        onSelectBranch={setActiveBranch}
      />
    </APIProvider>
  );
};

export default TitanLocationIntelligence;
