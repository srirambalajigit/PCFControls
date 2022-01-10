import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class PCFCustomFunctionsJS implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	outputs: IOutputs = {
		output1: undefined,
		output2: undefined
	}
	notifyOutputChanged: () => void;

	/**
	 * Empty constructor.
	 */
	constructor() {

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='standard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement) {
		this.notifyOutputChanged = notifyOutputChanged;
	}


	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void {
		console.debug("PCFJS:updateView");
		let debug = "";
		if (!context.parameters.functionName) return;

		debug = `Debug:\n${new Date().toLocaleTimeString()}\n${JSON.stringify({
			in1: context.parameters.input1,
			in2: context.parameters.input2
		}
		)}`;

		try {
			//Validating using Optionset
			//Execute the function chosen by the user in Optionset
			let functionName:string = (context.parameters.functionName.raw as string);

			//Math.tanh() Returns the hyperbolic tangent of a number.
			switch (functionName) {
				case "Math.tanh":
					   if(context.parameters.input1 && !isNaN(context.parameters.input1.raw))
							this.outputs.output1 = Math.tanh(context.parameters.input1.raw);
					break;
				case "Math.acosh":
					if(context.parameters.input1 && !isNaN(context.parameters.input1.raw))
						this.outputs.output1  = Math.acosh(context.parameters.input1.raw);
					break;
				case "MyCustomJSFunction":
						if(context.parameters.input1)
							this.outputs.output1  = this.MyCustomJSFunction(context.parameters.input1.raw as string);
						break;
				
				default:
					debug = `Error:Invalid Function\n${debug}`;
					break;
			}
		}
		catch (ex) {
			debug = `Error:${ex.message}\n${debug}`;
		}

		this.outputs.debug = debug;
		// Notify PCF things have changed
		this.notifyOutputChanged();
	}

	private MyCustomJSFunction(val:string):string
	{
		return 'Hello ' + val;
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs {
		console.debug("PCFJS:getOutputs");
		return this.outputs;
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void {

	}
}