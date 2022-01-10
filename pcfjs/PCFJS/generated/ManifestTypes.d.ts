/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    functionName: ComponentFramework.PropertyTypes.EnumProperty<"Math.tanh" | "Math.acosh" | "MyCustomJSFunction">;
    input1: ComponentFramework.PropertyTypes.Property;
    input2: ComponentFramework.PropertyTypes.Property;
    input3: ComponentFramework.PropertyTypes.Property;
}
export interface IOutputs {
    output1?: any;
    output2?: any;
    debug?: string;
}
