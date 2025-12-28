interface WithId {
  id: string;
}

export function trackByID<T extends WithId>(index: number, entity: T): string {
  return entity.id;
}
