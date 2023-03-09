export interface JerseyInternal {
  jerseyKey: string;
  jerseyPrimaryColor: string;
  jerseySecondaryColor: string;
  logo: string;
  boathouseId: string;
  id: string;
  userId: string;
}

export type CreateJerseyPayload = Pick<JerseyInternal, 'jerseyKey'|'jerseyPrimaryColor'|'jerseySecondaryColor'|'logo'|'boathouseId'>;
