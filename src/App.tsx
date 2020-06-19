import * as React from 'react';
import { LocalVideoEffectors, ModelConfigMobileNetV1, ModelConfigResNet, getDeviceLists } from 'local-video-effector'


/**
 * Main Component
 */
class App extends React.Component {

  localCanvasRef = React.createRef<HTMLCanvasElement>()
  localVideoEffectors : LocalVideoEffectors|null = null
  componentDidMount() {
    getDeviceLists().then((res)=>{
      console.log(res)
    })

    const model      = new URL(window.location.href).searchParams.get('model');
    const blurString = new URL(window.location.href).searchParams.get('blur')
    const blur = blurString === null ? 0 : parseInt(blurString)
    if(model === 'MobileNetV1'){
      this.localVideoEffectors = new LocalVideoEffectors(ModelConfigMobileNetV1)
    }else if (model === 'ResNet'){
      this.localVideoEffectors = new LocalVideoEffectors(ModelConfigResNet)
    }else{
      this.localVideoEffectors = new LocalVideoEffectors(null)
    }
    this.localVideoEffectors.selectInputVideoDevice("")
    this.localVideoEffectors.cameraEnabled              = true
    this.localVideoEffectors.virtualBackgroundEnabled   = true
    this.localVideoEffectors.virtualBackgroundImagePath = "/pic1.jpg"
    this.localVideoEffectors.maskBlurAmount             = blur
    this.localVideoEffectors.selectInputVideoDevice("").then(() => {
      requestAnimationFrame(() => this.drawVideoCanvas())
    })
  }

  drawVideoCanvas = () => {

    if (this.localCanvasRef.current !== null) {
      const width  = 640
      const height = 480
      this.localVideoEffectors!.doEffect(width,height)

      if (this.localVideoEffectors!.outputWidth !== 0 && this.localVideoEffectors!.outputHeight !== 0) {
        this.localCanvasRef.current.width  = width
        this.localCanvasRef.current.height = height
        const ctx = this.localCanvasRef.current.getContext("2d")!
        ctx.drawImage(this.localVideoEffectors!.outputCanvas, 0, 0, 
          this.localCanvasRef.current.width, this.localCanvasRef.current.height)
      }
    }
    requestAnimationFrame(() => this.drawVideoCanvas())
  }

  render() {
    return (
      <div style={{ width: "480px", margin: "auto" }}>
        <canvas ref={this.localCanvasRef}  style={{ display: "block", width: "480px", margin: "auto" }} />
      </div>
    )
  }
}

export default App;