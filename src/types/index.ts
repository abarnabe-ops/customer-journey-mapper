// ─── Node Types ───────────────────────────────────────────────────────────────

export type NodeShape = 'circle' | 'diamond' | 'browser' | 'textbox' | 'shape'

export interface NodeDef {
  type: string
  label: string
  cat: string
  sh: NodeShape
  bg?: string
  fg?: string
  borderColor?: string
  icon?: string
}

export interface CanvasNode {
  id: string
  type: string
  x: number
  y: number
  label?: string
  notes?: string
  // Page-specific
  pageStyle?: string
  // Size overrides
  nodeW?: number
  nodeH?: number
  // Textbox-specific
  width?: number
  height?: number
  text?: string
  font?: string
  size?: number
  color?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  align?: 'left' | 'center' | 'right'
  link?: string
  bgColor?: string
  svgLogo?: string
}

// ─── Connection Types ──────────────────────────────────────────────────────────

export interface CanvasConn {
  id: string
  from: string
  to: string
  dashed: boolean
  color: string
  curved: boolean
  midX?: number
  midY?: number
}

// ─── Campaign Types ────────────────────────────────────────────────────────────

export interface Campaign {
  id: string
  name: string
  nodes?: CanvasNode[]
  conns?: CanvasConn[]
  campName?: string
  brief?: Brief
  briefInitial?: string
}

// ─── Brief Types ───────────────────────────────────────────────────────────────

export interface Brief {
  campagne: string
  site: string
  objectif: string
  dateDebut: string
  dateFin: string
  annonce: string
  publicCible: string
  region: string
  tonalite: string
  leadMagnet: string
  sources: string[]
  notes: string
}

// ─── Version Types ─────────────────────────────────────────────────────────────

export interface Version {
  id: string
  name: string
  ts: string
}

export interface VersionData {
  nodes: CanvasNode[]
  conns: CanvasConn[]
  campName: string
}

// ─── Page Style Types ──────────────────────────────────────────────────────────

export interface PageStyle {
  id: string
  label: string
  thumb: React.ReactElement
}

// ─── History Types ─────────────────────────────────────────────────────────────

export interface HistorySnapshot {
  nodes: CanvasNode[]
  conns: CanvasConn[]
}

// ─── Drag State ────────────────────────────────────────────────────────────────

export interface DragState {
  id: string
  ox: number
  oy: number
  mx: number
  my: number
  pNodes: CanvasNode[]
  pConns: CanvasConn[]
  multiDrag: Array<{ id: string; ox: number; oy: number }> | null
}

export interface ResizeState {
  id: string
  ow: number
  oh: number
  ox: number
  oy: number
  mx: number
  my: number
  pNodes: CanvasNode[]
  pConns: CanvasConn[]
  mode: string
}

export interface MidConnDrag {
  id: string
  mx: number
  my: number
  ox: number
  oy: number
}

// ─── Auth Types ────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
    name?: string
    picture?: string
  }
}

// ─── Storage KV ────────────────────────────────────────────────────────────────

export interface StorageAdapter {
  get: (key: string) => Promise<{ value: string } | null>
  set: (key: string, value: string) => Promise<void>
  delete: (key: string) => Promise<void>
}
