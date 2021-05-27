import React from 'react'
import { DefaultFallBackComponent, DevErrorViewer } from './elements'
import { CrashCatcherMethods } from './methods';

/**
 * StepCrashCatcher App Container
 * @property {Function} AppRoot Application Root function
 * @property {Function} FallbackComponent onPressIamDev, onPressReset
 */

type props = { AppRoot: Function, FallbackComponent: Function }

class StepCrashCatcher extends React.Component<props> {

    constructor(props) {
        super(props)
        Object.keys(CrashCatcherMethods).forEach(key => {
            CrashCatcherMethods[key] = CrashCatcherMethods[key].bind(this)
        })
        this.state = { appError: '', isDev: __DEV__, }
    }
    resetState() { this.setState({ appError: '', isDev: __DEV__ }) }
    componentDidCatch(error: Error) { this.setState({ noError: false, appError: error.message }) }

    render() {
        const { appError, isDev } = this.state
        const noError = appError == ''
        let { AppRoot, FallbackComponent } = this.props
        FallbackComponent = FallbackComponent || DefaultFallBackComponent

        return (

            // Render App Navigation
            noError ? <AppRoot /> :

                // Render Error Viewer (For Developers)
                isDev ?
                    <DevErrorViewer
                        text={appError}
                        onPressReset={() => this.resetState()}
                    /> :

                    // Render FallbackComponent with props
                    <FallbackComponent
                        onPressIamDev={() => this.setState({ isDev: true })}
                        onPressReset={() => this.resetState()}
                    />
        )
    }
}
export default StepCrashCatcher