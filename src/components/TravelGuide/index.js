import {Component} from 'react'
import Loader from 'react-loader-spinner'
import TravelList from '../TravelList'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class TravelGuide extends Component {
  state = {
    places: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getGuidePlaces()
  }

  renderFormattedData = data => ({
    id: data.id,
    name: data.name,
    imageUrl: data.image_url,
    description: data.description,
  })

  getGuidePlaces = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const apiUrl = 'https://apis.ccbp.in/tg/packages'
    const response = await fetch(apiUrl)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.packages.map(eachData =>
        this.renderFormattedData(eachData),
      )
      console.log(updatedData)
      this.setState({
        places: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
  }

  renderLoadingView = () => (
    <div data-testid="loader" className="position">
      <Loader type="TailSP\pin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  renderPlacesView = () => {
    const {places} = this.state
    return (
      <ul className="places-list-container">
        {places.map(eachPlace => (
          <TravelList eachPlace={eachPlace} key={eachPlace.id} />
        ))}
      </ul>
    )
  }

  renderAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderPlacesView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="travel-container">
        <h1 className="heading">Travel Guide</h1>
        <hr className="separator" />
        {this.renderAllViews()}
      </div>
    )
  }
}

export default TravelGuide
