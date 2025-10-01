import FullScreenBlurry from './components/FullScreenBlurry'

export default function App() {
  return (
    <FullScreenBlurry
      intervalMs={20}
      maxBlurPx={30}
      respectReducedMotion={false} // ponelo en true en producción
    />
  )
}
