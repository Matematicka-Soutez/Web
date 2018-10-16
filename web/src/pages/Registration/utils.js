// TODO: Make option dates dynnamic
const REGISTRATION_OPTIONS = {
  1: {
    unfilled: 'Právě probíhá první kolo registrací. Nyní můžete přihlásit první tým.',
    full: `Máte úspěšně přihlášen jeden tým. Další tým budete moci (v případě nezaplnění
          kapacity soutěže) přihlásit v úterý 16. 10. 2018 od 7:30. Své už přihlášené týmy
          můžete editovat nejpozději do večera před soutěží.`,
  },
  2: {
    unfilled: 'Právě probíhá druhé kolo registrací. Nyní můžete přihlásit až dva týmy.',
    full: `Máte úspěšně přihlášeny dva týmy. Další tým budete moci (v případě nezaplnění
          kapacity soutěže) přihlásit v úterý 23. 10. 2018 od 7:30. Své už přihlášené týmy
          můžete editovat nejpozději do večera před soutěží.`,
  },
  3: {
    unfilled: 'Právě probíhá třetí kolo registrací. Nyní můžete přihlásit až tři týmy.',
    full: `Máte úspěšně přihlášeny tři týmy. Více týmů z jedné školy do soutěže přihlásit nelze.
          Své už přihlášené týmy můžete editovat nejpozději do večera před soutěží.`,
  },
  4: {
    full: `Registrace skončila. Stále nicméně můžete editovat své už registrované týmy.
          V případě změn tak prosím učiňte co nejdříve,
          velmi nám tím usnadníte práci a zrychlíte prezenci.`,
  },
}

function getRegistrationOptions(school, venues, registrationRound) {
  if (venuesAreFull(venues) && registrationRound.number < 4) {
    return `Kapacita soutěžních míst byla vyčerpána, již nelze registrovat další týmy.
            Své už přihlášené týmy můžete editovat nejpozději do večera před soutěží.`
  }
  const reachedTeamLimit = hasReachedTeamLimit(school, registrationRound)
  const variant = reachedTeamLimit ? 'full' : 'unfilled'
  return REGISTRATION_OPTIONS[registrationRound.number][variant]
}

function hasReachedTeamLimit(school, registrationRound) {
  const teamCount = (school.teams || []).length
  return teamCount >= registrationRound.teamLimit
}

function venuesAreFull(venues) {
  const isAnyUnfilled = venues
    .map(venue => venue.remainingCapacity <= 0)
    .includes(false)
  return !isAnyUnfilled
}

module.exports = {
  getRegistrationOptions,
  hasReachedTeamLimit,
}
