/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    meterValue: ComponentFramework.PropertyTypes.NumberProperty;
    minimum: ComponentFramework.PropertyTypes.NumberProperty;
    maximum: ComponentFramework.PropertyTypes.NumberProperty;
    low?: ComponentFramework.PropertyTypes.NumberProperty;
    high?: ComponentFramework.PropertyTypes.NumberProperty;
    optimum?: ComponentFramework.PropertyTypes.NumberProperty;
    Unit?: ComponentFramework.PropertyTypes.StringProperty;
}
export interface IOutputs {
    meterValue?: number;
}
