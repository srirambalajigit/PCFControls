import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class Meter implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // Value of the field is stored and used inside the control
    private _value: number;

    // PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
    private _notifyOutputChanged: () => void;

    // element that is used to create the meter 
    private meterElement: HTMLMeterElement;
       
     // Reference to the control container HTMLDivElement
    // This element contains all elements of Meter Control
    private _container: HTMLDivElement;

    // Reference to ComponentFramework Context object
    private _context: ComponentFramework.Context<IInputs>;

    // Event Handler 'refreshData' reference
    private _refreshData: EventListenerOrEventListenerObject;


	/**
	 * Empty constructor.
	 */
	constructor()
	{

	}

	/**
	 * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
	 * Data-set values are not initialized here, use updateView.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
	 * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
	 * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
	 * @param container If a control is marked control-type='starndard', it will receive an empty div element within which it can render its content.
	 */
	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
    {
        
	    this._context = context;

        //Create Container element DIV
        this._container = document.createElement("div");
        this._notifyOutputChanged = notifyOutputChanged;
        
        // creating HTML elements for the meter element and binding it to the function which refreshes the control data
        this.meterElement = document.createElement("meter");
        this.meterElement.setAttribute("id", "ctlmeter");
        this.meterElement.setAttribute("name", "ctlmeter");

        this.meterElement.addEventListener("input", this._refreshData);

        
        //Fetch the minimum and maximum properties of Meter control
        var minimum = context.parameters.minimum.raw;
        var maximum = context.parameters.maximum.raw;

        //Set the minimum and maximum attributes of Meter Control
        this.meterElement.setAttribute("min", minimum.toString());
        this.meterElement.setAttribute("max", maximum.toString());

        //Check whether high property is set by user
        if (context.parameters.high != null) {
            this.meterElement.setAttribute("high", context.parameters.high.raw.toString());
        }

        //Check whether low property is set by user
        if (context.parameters.low != null) {
            this.meterElement.setAttribute("low", context.parameters.low.raw.toString());
        }

        //Check whether optimum property is set by user
        if (context.parameters.optimum != null) {
            this.meterElement.setAttribute("optimum", context.parameters.optimum.raw.toString());
        }
        
        //add control elements to container
        this._container.appendChild(this.meterElement);
        container.appendChild(this._container);

	}

    /**
        * Updates the values to the internal value variable we are storing 
        * @param evt : The "Input Properties" containing the parameters, control metadata and interface functions
        */
    public refreshData(evt: Event): void {
        this._value = (this.meterElement.value as any) as number;
        this._notifyOutputChanged();
    }

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
    public updateView(context: ComponentFramework.Context<IInputs>): void {

        //Get the current value of meter and set it to internal value variable
        if (context.parameters.meterValue) {
            if (context.parameters.meterValue.raw != 0) {
                this._value = context.parameters.meterValue.raw;
                this.meterElement.setAttribute("value", this._value.toString());
            }
        }

        var maximum:string|null ="";
        
        //Fetch the maximum property of Meter control
        if (context.parameters.maximum) {
            if (context.parameters.maximum.raw != 0) {
                this.meterElement.setAttribute("max", context.parameters.maximum.raw.toString());
                maximum = context.parameters.maximum.raw.toString();
            }
            else {
                if (this.meterElement.getAttribute("max") != null)
                    maximum = this.meterElement.getAttribute("max");
            }
        }
       
        //Fetch the minimum properties of Meter control and set attribute of HTML tag
        var minimum = context.parameters.minimum.raw.toString();
        this.meterElement.setAttribute("min", context.parameters.minimum.raw.toString());

        
        //Check whether high property is set by user. This check is needed as required is false
        if (context.parameters.high) {
            if (context.parameters.high.raw!=0)
                this.meterElement.setAttribute("high", context.parameters.high.raw.toString());
        }

        //Check whether low property is set by user.This check is needed as required is false
        if (context.parameters.low) {
            if(context.parameters.low.raw!=0)
                this.meterElement.setAttribute("low", context.parameters.low.raw.toString());
        }

        //Check whether optimum property is set by user.This check is needed as required is false
        if (context.parameters.optimum) {
            if(context.parameters.optimum.raw!=0)
                this.meterElement.setAttribute("optimum", context.parameters.optimum.raw.toString());
        }

       
        //Unit of value shown in Meter control Eg litres,gallons,
        var unit = "";
        if (context.parameters.Unit) {
            unit = context.parameters.Unit.raw;
        }

        //Set the Title attribute
        var title = this._value.toString() + " out of " + maximum + " " + unit.toString();
        this.meterElement.setAttribute("title", title);

	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
        return {
            meterValue:this._value
        };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
	}
}