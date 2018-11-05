/* eslint-disable react/no-string-refs */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Highcharts from 'highcharts'
import ReactHighcharts from 'react-highcharts'
import { STRATEGIES } from '../../../core/enums'

class TournamentGraph extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tournamentNumber: props.tournamentNumber,
      strategies: props.strategies,
    }
  }

  componentWillUnmount() {
    this.refs.chart.destroy()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.tournamentNumber) {
      this.setState({ tournamentNumber: nextProps.tournamentNumber })
    }
    if (nextProps.strategies) {
      this.setState({ strategies: nextProps.strategies })
    }
  }

  render() {
    const { tournamentNumber, strategies } = this.state
    const graphConfig = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false,
        // don't animate in old IE
        animation: Highcharts.svg,
        height: '95%',
      },
      title: {
        text: `Výsledky<br>${tournamentNumber}. turnaje`,
        align: 'center',
        verticalAlign: 'middle',
        y: -27, // eslint-disable-line id-length
        style: {
          fontSize: '4em',
        },
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
      },
      credits: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: false,
          },
          size: '100%',
        },
      },
      series: [{
        type: 'pie',
        name: 'Strategy share',
        innerSize: '50%',
        data: getDataPoints(strategies, 'teamCount'),
      }, {
        type: 'pie',
        name: 'Strategy profit',
        innerSize: '75%',
        data: getDataPoints(strategies, 'profitSum'),
      }],
    }
    return <ReactHighcharts config={graphConfig} ref="chart"></ReactHighcharts>
  }
}

function getDataPoints(strategies, criterium) {
  return strategies.map(strategy => ({
    name: STRATEGIES.ids[strategy.strategy].name,
    y: strategy[criterium], // eslint-disable-line id-length
    dataLabels: {
      enabled: false,
    },
    color: STRATEGIES.ids[strategy.strategy].color,
  }))
}

TournamentGraph.propTypes = {
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired,
  tournamentNumber: PropTypes.number.isRequired,
}

export default TournamentGraph
