import {IInputs, IOutputs} from "./generated/ManifestTypes";

export class ColorPicker implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // Value of the field is stored and used inside the control
    private _value: string;

    // PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
    private _notifyOutputChanged: () => void;

    // div element created as part of this control
    private divElement: HTMLSpanElement;

    // input element that is used to create the range slider
    private inputElement: HTMLInputElement;

    // Reference to the control container HTMLDivElement
    // This element contains all elements of Color Control
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
        this._refreshData = this.refreshData.bind(this);


        // creating HTML elements for the input type color and  and binding it to the function which refreshes the control data
        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("type", "color");

        // Retrieving the default color value set by user in CRM UI and setting it to the HTML elements.
        this._value = context.parameters.color.raw;
        //If default color is not set, set the color to Green(#008000)
        this.inputElement.setAttribute("value", context.parameters.color.formatted ? context.parameters.color.formatted : "#008000");

        //this.inputElement.setAttribute("value", "#008000");
        this.inputElement.setAttribute("id", "clrctl");
        this.inputElement.addEventListener("input", this._refreshData);
        
        
        // creating a HTML DIV element whose background color is set to the color picked
        this.divElement = document.createElement("div");
        this.divElement.setAttribute("id", "clrdiv");
        //Set Foreground color to White
        this.divElement.style.color = "#FFFFFF";

        this.divElement.innerHTML = "Message with Color";

        // appending the HTML elements to the control's HTML container element.
        this._container.appendChild(this.divElement);
        this._container.appendChild(this.inputElement);

        container.appendChild(this._container);
      
    }

 
    /**
      * Updates the values to the internal value variable we are storing and also updates the html div background color
      * @param evt : The "Input Properties" containing the parameters, control metadata and interface functions
      */
    public refreshData(evt:Event): void {
        //Get the DIV element
        var divElement = document.getElementById("clrdiv");

         //Set the background color to color selected in Color Picker
         //Ask the TS compiler to ignore following statement as Typescript gives a compiler error that srcElement does not have value property
        //where as it is perfectly valid statement in Javascript
               
        // @ts-ignore
         divElement.style.backgroundColor = evt.srcElement.value;

        //Updates the values to the internal value variable
        // @ts-ignore
        this._value = evt.srcElement.value;

            
        this._notifyOutputChanged();
    }

          
	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
        // storing the latest context from the control.
        this._context = context;

        this._value = context.parameters.color.raw;
        this.inputElement.setAttribute("value", context.parameters.color.formatted ? context.parameters.color.formatted : "");
              
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
        return {
            color:this._value
        };
	}

	/** 
	 * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
	 * i.e. cancelling any pending remote calls, removing listeners, etc.
	 */
	public destroy(): void
	{
        this.inputElement.removeEventListener("input", this._refreshData);
	}
}