import React from 'react'


class ScrollToTop extends React.Component {
  constructor(props) {
    super(props)

    this.handleScroll = this.handleScroll.bind(this)
    this.state = {
      isScrolled: false,
    }
  }

  render() {
    return (
      <a
        className={`${
          this.state.isScrolled ? 'fadeIn' : ''
        } scroll-to-top rounded`}
        href="#top"
      >
        <i className="fas fa-angle-up" />
      </a>
    )
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.debounceScroll)
  }

  debounceScroll(event) {
    setTimeout(() => this.handleScroll(event), 300)
  }

  handleScroll() {
    const supportPageOffset = window.pageXOffset !== undefined // eslint-disable-line no-undefined
    const isCSS1Compat = (document.compatMode || '') === 'CSS1Compat'
    const scroll = {
      // eslint-disable-next-line
      x: supportPageOffset
        ? window.pageXOffset
        : isCSS1Compat
          ? document.documentElement.scrollLeft
          : document.body.scrollLeft,
      // eslint-disable-next-line
      y: supportPageOffset
        ? window.pageYOffset
        : isCSS1Compat
          ? document.documentElement.scrollTop
          : document.body.scrollTop,
    }
    // if we are not at the top of the page we are scrolled.
    this.setState({ isScrolled: scroll.y > 0 })
  }
}

export default ScrollToTop
