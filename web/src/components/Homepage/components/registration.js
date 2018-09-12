import React, { Component } from 'react'
import ScrollableAnchor from 'react-scrollable-anchor'

class RegistrationSection extends Component {

  constructor(props) {
    super(props)
    this.state = { errors: [] }
    this.onSubmit = this.onSubmit.bind(this)
  }

  onSubmit(event) {
    event.preventDefault()
    // Additional validations
    const newErrors = []
    if (
      !(event.target.firstName4.value !== '' && event.target.lastName4.value !== '' && event.target.grade4.value !== '') // eslint-disable-line max-len
      && !(event.target.firstName4.value === '' && event.target.lastName4.value === '' && event.target.grade4.value === '') // eslint-disable-line max-len
    ) {
      newErrors.push('Čtvrtý člen týmu nutně není povinný, ale musí být vyplněn kompletně nebo vůbec.') // eslint-disable-line max-len
    }
    const gradeSum = parseInt(event.target.grade1.value, 10)
      + parseInt(event.target.grade2.value, 10)
      + parseInt(event.target.grade3.value, 10)
      + (event.target.grade4.value !== '' ? parseInt(event.target.grade4.value, 10) : 0)
    if (gradeSum > 32) {
      newErrors.push('Součet ročníků členů týmu nesmí přesáhnout 32.')
    }
    if (newErrors.length > 0) {
      this.setState({ errors: newErrors })
      return
    }

    // Form submission
    const payload = {
      teamName: event.target.teamName.value,
      school: event.target.school.value,
      email: event.target.email.value,
      members: [{
        firstName: event.target.firstName1.value,
        lastName: event.target.lastName1.value,
        grade: event.target.grade1.value,
      }, {
        firstName: event.target.firstName2.value,
        lastName: event.target.lastName2.value,
        grade: event.target.grade2.value,
      }, {
        firstName: event.target.firstName3.value,
        lastName: event.target.lastName3.value,
        grade: event.target.grade3.value,
      }],
    }
    if (event.target.firstName4.value !== '') {
      payload.members.push({
        firstName: event.target.firstName4.value,
        lastName: event.target.lastName4.value,
        grade: event.target.grade4.value,
      })
    }
    event.preventDefault()
    fetch(`${window.location.protocol}//${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}/api/registration`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then(res => res.json())
      .then(
        result => {
          if (result.success) {
            this.setState({
              errors: [],
              submissionResult: 'success',
            })
          } else {
            this.setState({
              errors: [],
              submissionResult: 'fail',
            })
          }
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          console.log(error) // eslint-disable-line no-console
          this.setState({
            errors: [],
            submissionResult: 'fail',
          })
        },
      )
  }

  render() {
    const form = (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="teamName">Název týmu</label>
          <input type="text" className="form-control"
            id="teamName" placeholder="Binární housenky" required />
        </div>
        <div className="form-group">
          <div className="row">
            <div className="col">
              <label htmlFor="school">Škola</label>
              <input type="text" className="form-control"
                id="school" placeholder="ZŠ Děčín II, Kamenická 1145" required />
            </div>
            <div className="col">
              <label htmlFor="email">Kontaktní email</label>
              <input type="email" className="form-control"
                id="email" placeholder="email@example.org" required />
            </div>
          </div>
        </div>
        <div className="form-group">
          <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col col-md-2">
              <label htmlFor="member1">Složení týmu</label>
              <input type="text" readOnly className="form-control-plaintext"
                id="member1" value="1." />
            </div>
            <div className="col col-md-4">
              <label htmlFor="firstName1">Jméno</label>
              <input type="text" className="form-control" id="firstName1" placeholder="" required />
            </div>
            <div className="col col-md-4">
              <label htmlFor="lastName1">Příjmení</label>
              <input type="text" className="form-control" id="lastName1" placeholder="" required />
            </div>
            <div className="col col-md-2">
              <label htmlFor="grade1">Ročník</label>
              <select className="custom-select" id="grade1" required>
                <option defaultValue=""></option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col col-md-2">
              <input type="text" readOnly className="form-control-plaintext"
                id="member2" value="2." />
            </div>
            <div className="col col-md-4">
              <input type="text" className="form-control" id="firstName2" placeholder="" required />
            </div>
            <div className="col col-md-4">
              <input type="text" className="form-control" id="lastName2" placeholder="" required />
            </div>
            <div className="col col-md-2">
              <select className="custom-select" id="grade2" required>
                <option defaultValue=""></option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col col-md-2">
              <input type="text" readOnly className="form-control-plaintext"
                id="member3" value="3." />
            </div>
            <div className="col col-md-4">
              <input type="text" className="form-control" id="firstName3" placeholder="" required />
            </div>
            <div className="col col-md-4">
              <input type="text" className="form-control" id="lastName3" placeholder="" required />
            </div>
            <div className="col col-md-2">
              <select className="custom-select" id="grade3" required>
                <option defaultValue=""></option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </div>
          </div>
          <div className="row" style={{ marginBottom: '10px' }}>
            <div className="col col-md-2">
              <input type="text" readOnly className="form-control-plaintext"
                id="member4" value="4." />
            </div>
            <div className="col col-md-4">
              <input type="text" className="form-control" id="firstName4" placeholder="" />
            </div>
            <div className="col col-md-4">
              <input type="text" className="form-control" id="lastName4" placeholder="" />
            </div>
            <div className="col col-md-2">
              <select className="custom-select" id="grade4">
                <option defaultValue=""></option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
              </select>
            </div>
          </div>

        </div>
        {this.state.errors.map((error, index) => <div className="text-danger" key={index}>{error}</div>)}
        <div className="text-center" style={{ marginTop: '15px' }}>
          <button type="submit" className="btn btn-primary btn-lg">Odeslat</button>
        </div>
      </form>
    )
    const submissionMessage = this.state.submissionResult === 'success'
      ? (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Děkujeme!</h4>
          <p>
            Úspěšně jste zaregistrovali svůj tým do Děčínského matematického klání.
            Ve čtvrtek 13. 9. se na Vás budeme těšit v aule Gymnázia Děčín.
            Potřebujete pouze tužku a papír, elektronické pomůcky jsou v soutěži zakázány.
          </p>
          <hr />
          <p className="mb-0">
            Do 24 hodin Vám přijde potvrzující email.
            S případnými dotazy se prosím co nejdříve obraťte na Štěpánku Gennertovou
            (<a href="mailto:gennertova@gmail.com">gennertova@gmail.com</a>).
          </p>
        </div>
      )
      : (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Pozor!</h4>
          <p>
            Registrace se bohužel nezdařila. Zkuste to prosím později ještě jednou
            a pokud problém přetrvá, kontaktujte prosím Štěpánku Gennertovou
            (<a href="mailto:gennertova@gmail.com">gennertova@gmail.com</a>).
          </p>
        </div>
      )
    return (
      <ScrollableAnchor id="registrace">
        <section className="content-section">
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto">
                <div className="content-section-heading text-center">
                  <h2 className="mb-5">Registrace</h2>
                </div>
                <p className="lead text-justify">
                  Pro účast v DěMaKu je nutné se předem zaregistrovat, abychom věděli,
                  s kolika týmy můžeme počítat.
                  K registraci stačí vyplnit formulář níže do 10. 9. 2018 včetně.
                  Kontaktní email slouží pro zaslání podrobnějších informací před kláním.
                </p>

                {!this.state.submissionResult ? form : submissionMessage }

              </div>
            </div>
          </div>
        </section>
      </ScrollableAnchor>
    )
  }

}

export default RegistrationSection
