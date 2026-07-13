export type DiaSemana = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface AvailabilitySlot {
  diaSemana: DiaSemana;
  horaInicio: string; // "08:00"
  horaFim: string; // "18:00"
  ativo: boolean;
}

/** Configuração de disponibilidade semanal do prestador. */
export interface ProviderAvailability {
  prestadorId: number;
  slots: AvailabilitySlot[];
  /** Datas específicas bloqueadas (férias, compromissos), formato ISO. */
  datasBloqueadas: string[];
}

export interface UpdateAvailabilityPayload {
  slots: AvailabilitySlot[];
  datasBloqueadas: string[];
}
