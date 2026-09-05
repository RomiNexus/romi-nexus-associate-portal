// src/components/ui/index.jsx
// Barrel — single import point for all Romi Nexus UI primitives.
// All components resolve tokens from shell/tokens.js (T).

// ─── Primitives (from index.jsx inline set) ────────────────────────────────────
export {
  sc, timeAgo, daysUntil, expiryColor,
  M,
  Tag,
  Btn,
  Panel,
  KpiCard,
  RiskBar,
  Sparkline,
  ProgressCircle,
  FilterInput,
  Th, Td, NxTable,
  Sheet,
  Modal,
  FormField, NxInput, NxSelect, NxTextarea,
  Divider,
  EmptyState,
  Skeleton,
  LiveDot,
  EddWarningBadge,
  classifyCommodityTier,
} from './_primitives.jsx';

// ─── Icon ─────────────────────────────────────────────────────────────────────
export { Icon, ICON_NAMES } from './Icon.jsx';

// ─── StatusBadge ─────────────────────────────────────────────────────────────
export { StatusBadge, statusColor } from './StatusBadge.jsx';

// ─── DataTable ───────────────────────────────────────────────────────────────
export { DataTable } from './DataTable.jsx';

// ─── MetricCard ──────────────────────────────────────────────────────────────
export { MetricCard } from './MetricCard.jsx';
