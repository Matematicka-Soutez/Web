// TODO: split into container and component

import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import { API_ADDRESS } from '../../config'
import { subscribeToResultsChange } from '../../sockets/index'

const rootStyle = {
  margin: '16px 8px 8px 8px',
  overflowX: 'none',
  paddingTop: 16,
  paddingBottom: 0,
}

const smallColumnWidth = {
  width: 10,
  padding: '4px 20px 4px 8px',
}

const smallPadding = {
  padding: '4px 20px 4px 8px',
}

class ResultsContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      results: null,
    }
    subscribeToResultsChange((err, newResults) => {
      if (err) {
        return
      }
      if (newResults && newResults !== {}) {
        this.setState({
          results: newResults,
        })
      }
    })
  }

  async componentWillMount() {
    try {
      const res = await fetch(`${API_ADDRESS}/api/competitions/current/game/results`)
      const results = await res.json()
      this.setState({ results })
    } catch (err) {
      // TODO: proper logging
      console.log(err) // eslint-disable-line no-console
    }
  }

  render() {
    const { results } = this.state
    if (!results) {
      return <div className="results">Loading ...</div>
    }

    let id = 0
    const createData = result => {
      id += 1
      return { ...result, id }
    }

    const data = []
    results.forEach(result => {
      data.push(createData(result))
    })
    return (
      <div className="results">
        <Paper style={rootStyle}>
          <Typography
            variant="headline"
            style={{ textAlign: 'center', marginBottom: 16 }}>
            Výsledky podzimního MaSa 2018
          </Typography>
          <Typography component="div">
            <Table style={{ minWidth: 780 }}>
              <TableHead>
                <TableRow>
                  <TableCell numeric style={smallColumnWidth}>Pořadí</TableCell>
                  <TableCell numeric style={smallColumnWidth}>Číslo týmu</TableCell>
                  <TableCell style={smallPadding}>Název týmu</TableCell>
                  <TableCell style={smallPadding}>Škola</TableCell>
                  <TableCell style={smallPadding}>Soutěžící</TableCell>
                  <TableCell style={smallColumnWidth}>Místnost</TableCell>
                  <TableCell numeric style={{ ...smallPadding, minWidth: 50 }}>
                  Body ve hře
                  </TableCell>
                  <TableCell numeric style={smallColumnWidth}>Body za příklady</TableCell>
                  <TableCell numeric style={{ ...smallPadding, minWidth: 55 }}>
                  Body celkem
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map(row => (
                  <TableRow key={row.id}>
                    <TableCell numeric component="th" scope="row" style={smallColumnWidth}>
                      {row.place}
                    </TableCell>
                    <TableCell numeric style={smallColumnWidth}>{row.teamNumber}</TableCell>
                    <TableCell style={{ ...smallPadding, fontWeight: 'bold' }}>
                      {row.teamName}
                    </TableCell>
                    <TableCell style={smallPadding}>{row.school}</TableCell>
                    <TableCell style={smallPadding}>
                      {row.teamMembers.map(member =>
                        <span key={member.id}>{member.name}<br /></span>)}
                    </TableCell>
                    <TableCell style={smallColumnWidth}>{row.room}</TableCell>
                    <TableCell numeric style={{ ...smallPadding, minWidth: 50 }}>
                      {row.gameScore}
                    </TableCell>
                    <TableCell numeric style={smallColumnWidth}>{row.problemScore}</TableCell>
                    <TableCell numeric style={{ smallPadding, fontWeight: 'bold', minWidth: 55 }}>
                      {row.totalScore}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Typography>
        </Paper>
      </div>
    )
  }
}

export default ResultsContainer
