import {IInputs, IOutputs} from "./generated/ManifestTypes";
import { array } from "prop-types";

export class Autocomplete implements ComponentFramework.StandardControl<IInputs, IOutputs> {

    // Value of the field is stored and used inside the control 
    private _value: string;

    //Stores the list of options  separated by comma
    private _options: string;

    // PCF framework delegate which will be assigned to this object which would be called whenever any update happens. 
    private _notifyOutputChanged: () => void;

     // input element that is used to create the autocomplete
    private inputElement: HTMLInputElement;

    //Datalist element
    private datalistElement: HTMLDataListElement;

    // Reference to the control container HTMLDivElement
    // This element contains all elements of our custom control 
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
        this._container = document.createElement("div");
        this._notifyOutputChanged = notifyOutputChanged;
        this._refreshData = this.refreshData.bind(this);

        // creating HTML elements for the input type list and binding it to the function which refreshes the control data
        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("list", "ctllist");
        this.inputElement.setAttribute("name", "ctlautocomplete");
        this.inputElement.addEventListener("input", this._refreshData);
        
        // creating HTML elements for data list 
        this.datalistElement = document.createElement("datalist");
        this.datalistElement.setAttribute("id", "ctllist");

        //Create options for data list
        var optionsHTML = "";
        var optionsHTMLarr = new Array();

        var optionsPropValue = context.parameters.options.raw;
        var options: string[];

        if (optionsPropValue) {
            //Split comma separated values and dump to an option array
            options = optionsPropValue.split(",");

            for (var i = 0; i < options.length; ++i) {
                optionsHTMLarr.push('<option value="');
                optionsHTMLarr.push(options[i].toString());
                optionsHTMLarr.push('" />');
            }
            optionsHTML = optionsHTMLarr.join("");
        }

        //@ts-ignore 
        this.datalistElement.innerHTML = optionsHTML;

                        
        // appending the HTML elements to the control's HTML container element.
        //Add input element
        this._container.appendChild(this.inputElement);

        //Add datalist element
        this._container.appendChild(this.datalistElement);
        container.appendChild(this._container);
    
    }


    /**
		 * Updates the values to the internal value variable we are storing and also updates the html label that displays the value
		 * @param evt : The "Input Properties" containing the parameters, control metadata and interface functions
		 */
    public refreshData(evt: Event): void {
        this._value = (this.inputElement.value as any) as string;
        this._notifyOutputChanged();
    }

	/**
	 * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
	 * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
	 */
	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
        this._context = context;
        this._options = this._context.parameters.options.raw;

        //Set the background Color if property is set by the user
        if (this._context.parameters.backgroundColor) {
            this.inputElement.style.backgroundColor = this._context.parameters.backgroundColor.raw;
        }
       

        //Populate the Datalist Options        
        var optionsHTML = "";
        var optionsHTMLarr = new Array();

        var optionsPropValue = context.parameters.options.raw;
        var options: string[];

        if (optionsPropValue) {
            options = optionsPropValue.split(",");

            for (var i = 0; i < options.length; ++i) {
                optionsHTMLarr.push('<option value="');
                optionsHTMLarr.push(options[i].toString());
                optionsHTMLarr.push('" />');
            }
            optionsHTML = optionsHTMLarr.join("");
        }

        //@ts-ignore 
        this.datalistElement.innerHTML = optionsHTML;
    
	}

	/** 
	 * It is called by the framework prior to a control receiving new data. 
	 * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
	 */
	public getOutputs(): IOutputs
	{
        return {
            selectedValue:this._value
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