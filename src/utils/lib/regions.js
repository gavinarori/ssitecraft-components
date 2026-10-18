// ISO 3166-1 alpha-2 codes of African countries. Used to pick the default checkout option.
export const AFRICA = new Set(
  'DZ AO BJ BW BF BI CV CM CF TD KM CG CD CI DJ EG GQ ER SZ ET GA GM GH GN GW KE LS LR LY MG MW ML MR MU MA MZ NA NE NG RW ST SN SC SL SO ZA SS SD TZ TG TN UG ZM ZW'.split(' ')
)

export const isAfrica = (countryCode) => AFRICA.has(String(countryCode ?? '').toUpperCase())