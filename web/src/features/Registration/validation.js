function validateTeamForm(form) {
  const errors = []

  if (
    !(form.firstName4.value !== '' && form.lastName4.value !== '' && form.grade4.value !== '')
    && !(form.firstName4.value === '' && form.lastName4.value === '' && form.grade4.value === '')
  ) {
    errors.push('Čtvrtý člen týmu nutně není povinný, ale musí být vyplněn kompletně nebo vůbec.')
  }

  const gradeSum = (form.grade1.value !== '' ? parseInt(form.grade1.value, 10) : 0)
    + (form.grade2.value !== '' ? parseInt(form.grade2.value, 10) : 0)
    + (form.grade3.value !== '' ? parseInt(form.grade3.value, 10) : 0)
    + (form.grade4.value !== '' ? parseInt(form.grade4.value, 10) : 0)
  if (gradeSum > 32) {
    errors.push('Součet ročníků členů týmu nesmí přesáhnout 32.')
  }

  if (form.grade1.value === ''
    || form.grade2.value === ''
    || form.grade3.value === '') {
    errors.push('Ročníky všech členů musí být vyplněny.')
  }

  if (form.competitionVenueId.value === '') {
    errors.push('Vyberte prosím, kde bude tým soutěžit.')
  }

  return errors
}

export default validateTeamForm
