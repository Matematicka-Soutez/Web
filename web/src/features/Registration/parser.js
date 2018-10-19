function parseTeamForm(form) {
  const payload = {
    id: form.teamId && parseInt(form.teamId.value),
    teamName: form.teamName.value,
    competitionVenueId: parseInt(form.competitionVenueId.value),
    members: [{
      id: form.teamMemberId1 && parseInt(form.teamMemberId1.value),
      firstName: form.firstName1.value,
      lastName: form.lastName1.value,
      grade: parseInt(form.grade1.value),
    }, {
      id: form.teamMemberId2 && parseInt(form.teamMemberId2.value),
      firstName: form.firstName2.value,
      lastName: form.lastName2.value,
      grade: parseInt(form.grade2.value),
    }, {
      id: form.teamMemberId3 && parseInt(form.teamMemberId3.value),
      firstName: form.firstName3.value,
      lastName: form.lastName3.value,
      grade: parseInt(form.grade3.value),
    }],
  }
  if (form.firstName4.value !== '' && form.lastName4.value !== '' && form.grade4.value !== '') {
    payload.members.push({
      id: form.teamMemberId4 && parseInt(form.teamMemberId4.value),
      firstName: form.firstName4.value,
      lastName: form.lastName4.value,
      grade: parseInt(form.grade4.value),
    })
  }
  return payload
}

export default parseTeamForm
