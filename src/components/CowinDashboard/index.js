// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

class CowinDashboard extends Component {
  state = {chartData: '', renderStatus: ''}

  componentDidMount() {
    console.log('Mounted')
    this.getData()
  }

  getData = async () => {
    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)

    if (response.ok) {
      const data = await response.json()
      const vaccinationData = {
        lastSevenDaysVaccination: data.last_7_days_vaccination.map(items => ({
          vaccineDate: items.vaccine_date,
          dose1: items.dose_1,
          dose2: items.dose_2,
        })),
        vaccinationByAge: data.vaccination_by_age,
        vaccinationByGender: data.vaccination_by_gender,
      }
      this.setState({chartData: vaccinationData, renderStatus: 'SUCCESS'})
    } else {
      this.setState({renderStatus: 'FAILURE'})
    }
  }

  renderChartData = () => {
    const {chartData} = this.state

    return (
      <>
        <VaccinationCoverage
          key="vaccination coverage"
          vaccinationCoverageData={chartData.lastSevenDaysVaccination}
        />

        <VaccinationByGender
          key="vaccination data by age"
          vaccinationByGenderData={chartData.vaccinationByGender}
        />

        <VaccinationByAge
          key="vaccination by Age"
          vaccinationByAgeData={chartData.vaccinationByAge}
        />
      </>
    )
  }

  renderFinalOutput = () => {
    const {renderStatus} = this.state
    switch (renderStatus) {
      case 'SUCCESS':
        return this.renderChartData()
      case 'FAILURE':
        return this.renderFailurePage()
      default:
        return this.renderLoader()
    }
  }

  renderFailurePage = () => (
    <div className="failure-pag-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-page"
      />
      <h1 className="fail-text">Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  render() {
    return (
      <div className="main-container">
        <div className="logo-heading">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="logo"
          />
          <p className="logo-heading">Co-WIN</p>
        </div>
        <h1 className="page-description">CoWIN Vaccination in India</h1>
        <div>{this.renderFinalOutput()}</div>
      </div>
    )
  }
}

export default CowinDashboard
