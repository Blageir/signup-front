import ReactTestRenderer from 'react-test-renderer'
require('../../lib/tests/utils')
import Header from '../header'

describe('components | Header', () => {
  describe('render', () => {
    const renderer = ReactTestRenderer.create(<Header />)
    it('should be defined', () => {
      expect(renderer).toBeDefined()
    })
    it('should match snapshot', () => {
      expect(renderer).toMatchSnapshot()
    })
  })
})
