export type StellarEvent =
  | { type: "stageChanged"; from: string; to: string; ageYears: number }
  | { type: "supernova"; energyJ: number; remnantMassSolar: number }
  | { type: "reset" }
  | { type: "tick"; ageYears: number };

type Handler<T extends StellarEvent> = (event: T) => void;

export class EventBus {
  private handlers = new Map<StellarEvent["type"], Set<(event: StellarEvent) => void>>();

  on<T extends StellarEvent["type"]>(
    type: T,
    handler: Handler<Extract<StellarEvent, { type: T }>>
  ): () => void {
    const set = this.handlers.get(type) ?? new Set();
    const wrapped = handler as (event: StellarEvent) => void;
    set.add(wrapped);
    this.handlers.set(type, set);
    return () => set.delete(wrapped);
  }

  emit(event: StellarEvent): void {
    this.handlers.get(event.type)?.forEach((handler) => handler(event));
  }

  clear(): void {
    this.handlers.clear();
  }
}
