/**
 * Created by Marcela on 26. 1. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/// <reference path="typing/moment.d.ts" />
/// <reference path="Spinner.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Numeric;
(function (Numeric) {
    var interval;
    /**
     * Base class that implements IEvents interface. It provides basic implementation
     * of all events. It contains virtual method "changeValue" which is overridden
     * in each inherited class.
     *
     * @class SpinnerEvents
     * @implements {IEvents}
     *
     * @param {Spinner} spinner - Class that contains all necessary properties
     * @param {string} direction - Value "up" or "down" defines increasing or decreasing value
     * @param {string} value - Input value
     * @param {boolean} startDown - Private property that identifies whether mouse down is holding
    */
    var SpinnerEvents = (function () {
        function SpinnerEvents(spinner) {
            var _this = this;
            this.startDown = false;
            this.spinner = spinner;
            this.spinner.inputElement.on("mousewheel", function (e) { return _this[e.type](e); });
            this.spinner.buttonElement.on("mousedown mouseup", "button", function (e) { return _this[e.type](e); });
        }
        /**
         * Mouse down event sets property startDown to true
         * and calls 'changeValue' function.
         * The call is produced repeatedly until
         * event 'mouseup' occurs.
         *
         * @method mousedown
         * @param {JQueryEventObject} e - Event handler
         */
        SpinnerEvents.prototype.mousedown = function (e) {
            var _this = this;
            this.startDown = true;
            var el = $(e.target).closest('button'), direction = el.attr('data-direction'), value = this.spinner.inputElement.val();
            if (!isNaN(value) && value !== this.value) {
                this.value = value;
            }
            this.changeValue(direction);
            interval = setInterval(function () { return _this.changeValue(direction); }, 400);
        };
        /**
         * Mouse up event sets property startDown to false
         * and clears interval.
         *
         * @method mouseup
         * @param {JQueryEventObject} e - Event handler
         */
        SpinnerEvents.prototype.mouseup = function (e) {
            this.startDown = false;
            clearInterval(interval);
        };
        /**
         * Mouse wheel event provides changing value.
         * This uses jquery.mousewheel.js library to detect
         * direction of user's mouse wheel.
         *
         * @method mousewheel
         * @param {JQueryEventObject} e - Event handler
         */
        SpinnerEvents.prototype.mousewheel = function (e) {
            if (this.spinner.scrollable && this.spinner.inputElement.is(":focus")) {
                e.preventDefault();
                var direction = e.deltaY === 1 ? "up" : "down";
                this.changeValue(direction);
            }
        };
        /**
         * Virtual method to be overridden.
         *
         * @param {string} direction - Value "up" or "down" defines increasing or decreasing value
        */
        SpinnerEvents.prototype.changeValue = function (direction) {
            throw "Virtual method";
        };
        return SpinnerEvents;
    })();
    Numeric.SpinnerEvents = SpinnerEvents;
    /*
    * This class provides functionality for NUMBER values. It extends base class
    * and has implemented own method "changeValue".
    *
    * @class NumberSpinner
    * @extends {SpinnerEvents}
    *
    * */
    var NumberSpinner = (function (_super) {
        __extends(NumberSpinner, _super);
        function NumberSpinner(spinner) {
            _super.call(this, spinner);
        }
        /**
         * In class that provides functionality for NUMBER values.
         * This function changes value based on direction and step
         * and rounds value according to precision.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        NumberSpinner.prototype.changeValue = function (direction) {
            var value = Number(this.spinner.inputElement.val()), step = this.spinner.step, precision = this.spinner.precision;
            if (direction === "up") {
                value += step;
            }
            else {
                value -= step;
            }
            this.value = value.toFixed(precision);
            this.spinner.inputElement.val(this.value);
        };
        return NumberSpinner;
    })(SpinnerEvents);
    Numeric.NumberSpinner = NumberSpinner;
    /*
     * This class provides functionality for DATE values. It extends base class
     * and has implemented own method "changeValue". This class needs properties
     * dateFormat to display date in input field and stepUnit to define unit for changing
     * value.
     * Values of dateFormat are based on moment.js date formats, default
     * format is used in en-us date format "MM/DD/YYYY".
     * Values of stepUnit property are days, months or years, default unit is "days".
     *
     * @class NumberSpinner
     * @extends {SpinnerEvents}
     *
     * */
    var DateSpinner = (function (_super) {
        __extends(DateSpinner, _super);
        function DateSpinner(spinner) {
            _super.call(this, spinner);
            if (!spinner.dateFormat) {
                spinner.dateFormat = "MM/DD/YYYY";
            }
            if (!spinner.stepUnit) {
                spinner.stepUnit = "days";
            }
        }
        /**
         * In class that provides functionality for DATE values. It extends base class
         * and has implemented own method "changeValue". This class needs properties
         * dateFormat to display date in input field and stepUnit to define unit for changing
         * value.
         * Values of dateFormat are based on moment.js date formats, default
         * format is used in en-us date format "MM/DD/YYYY".
         * Values of stepUnit property are days, months or years, default unit is "days".
         *
         * This function changes value based on direction, unit and step
         * and set new value to input field in custom date format.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        DateSpinner.prototype.changeValue = function (direction) {
            var value = this.spinner.inputElement.val(), momentDate = moment(value), format = this.spinner.dateFormat, step = this.spinner.step, unit = this.spinner.stepUnit;
            if (!momentDate.isValid()) {
                momentDate = moment();
            }
            if (direction === "up") {
                momentDate.add(step, unit);
            }
            else {
                momentDate.subtract(step, unit);
            }
            this.value = momentDate.format(format);
            this.spinner.inputElement.val(this.value);
        };
        return DateSpinner;
    })(SpinnerEvents);
    Numeric.DateSpinner = DateSpinner;
    /*
     * This class provides functionality for TIME values. It extends base class
     * and has implemented own method "changeValue". This class needs properties
     * dateFormat to display date in input field and stepUnit to define unit for changing
     * value.
     * Values of dateFormat are based on moment.js date formats, default
     * format is used in en-us time format with 12 hour's cycle "h:mm:ss A".
     * Values of stepUnit property are hours, minutes and seconds, default unit is "hours".
     *
     * @class NumberSpinner
     * @extends {SpinnerEvents}
     *
     * */
    var TimeSpinner = (function (_super) {
        __extends(TimeSpinner, _super);
        function TimeSpinner(spinner) {
            _super.call(this, spinner);
            if (!spinner.dateFormat) {
                spinner.dateFormat = "h:mm:ss A";
            }
            if (!spinner.stepUnit) {
                spinner.stepUnit = "hours";
            }
        }
        /**
         * In class that provides functionality for TIME values. It extends base class
         * and has implemented own method "changeValue". This class needs properties
         * dateFormat to display date in input field and stepUnit to define unit for changing
         * value.
         * Values of dateFormat are based on moment.js date formats, default
         * format is used in en-us time format with 12 hour's cycle "h:mm:ss A".
         * Values of stepUnit property are hours, minutes and seconds, default unit is "hours".
         *
         * This function changes value based on direction, unit and step
         * and set new value to input field in custom time format.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        TimeSpinner.prototype.changeValue = function (direction) {
            var value = this.spinner.inputElement.val(), format = this.spinner.dateFormat, step = this.spinner.step, unit = this.spinner.stepUnit;
            var momentDate = this.assembleMomentDate(value);
            if (direction === "up") {
                momentDate.add(step, unit);
            }
            else {
                momentDate.subtract(step, unit);
            }
            this.value = momentDate.format(format);
            this.spinner.inputElement.val(this.value);
        };
        /**
         * Since moment.js library does not allow manipulate only with time part of datetime
         * it is necessary to create valid value consisting of date and time.
         * This function assemble new datetime and uses actual value.
         * This is necessary for correct functionality of increasing and
         * decreasing time. Only time part of moment value is used for changing
         * and displaying value in input field.
         *
         * @method assembleMomentDate
         * @param {string} time - Original time value from input field
        * */
        TimeSpinner.prototype.assembleMomentDate = function (time) {
            var today = new Date(), momentTime = moment(time, this.spinner.dateFormat);
            if (!momentTime.isValid()) {
                return moment();
            }
            return moment([today.getFullYear(), today.getMonth(), today.getDate(), momentTime.hours(), momentTime.minutes(), momentTime.seconds()]);
        };
        return TimeSpinner;
    })(SpinnerEvents);
    Numeric.TimeSpinner = TimeSpinner;
    /*
     * This class provides functionality for DATETIME values. It extends base class
     * and has implemented own method "changeValue". This class needs properties
     * dateFormat to display date in input field and stepUnit to define unit for changing
     * value.
     * Values of dateFormat are based on moment.js date formats, default
     * format is used in en-us date time format "MM/DD/YYYY h:mm:ss A".
     * Values of stepUnit property are combination of date and time properties, that is
     * days, months, years, hours, minutes and seconds, default unit is "days".
     *
     * @class NumberSpinner
     * @extends {SpinnerEvents}
     *
     * */
    var DateTimeSpinner = (function (_super) {
        __extends(DateTimeSpinner, _super);
        function DateTimeSpinner(spinner) {
            _super.call(this, spinner);
            if (!spinner.dateFormat) {
                spinner.dateFormat = "MM/DD/YYYY h:mm:ss A";
            }
            if (!spinner.stepUnit) {
                spinner.stepUnit = "days";
            }
        }
        /**
         *
         * In class that provides functionality for DATETIME values. It extends base class
         * and has implemented own method "changeValue". This class needs properties
         * dateFormat to display date in input field and stepUnit to define unit for changing
         * value.
         * Values of dateFormat are based on moment.js date formats, default
         * format is used in en-us date time format "MM/DD/YYYY h:mm:ss A".
         * Values of stepUnit property are combination of date and time properties, that is
         * days, months, years, hours, minutes and seconds, default unit is "days".
         * This function changes value based on direction, unit and step
         * and set new value to input field in custom time format.
         *
         * @override
         * @method changeValue
         * @param {string} direction - Direction of changing value ("up" for increase, "down" for decrease)
         */
        DateTimeSpinner.prototype.changeValue = function (direction) {
            var value = this.spinner.inputElement.val(), momentDate = moment(value), format = this.spinner.dateFormat, step = this.spinner.step, unit = this.spinner.stepUnit;
            if (!momentDate.isValid()) {
                momentDate = moment();
            }
            if (direction === "up") {
                momentDate.add(step, unit);
            }
            else {
                momentDate.subtract(step, unit);
            }
            this.value = momentDate.format(format);
            this.spinner.inputElement.val(this.value);
        };
        return DateTimeSpinner;
    })(SpinnerEvents);
    Numeric.DateTimeSpinner = DateTimeSpinner;
})(Numeric || (Numeric = {}));
/**
 * Created by Marcela on 26. 1. 2015.
 */
/// <reference path="typing/jquery.d.ts" />
/// <reference path="SpinnerEvents.ts" />
var Numeric;
(function (Numeric) {
    /**
     * Initial class that sets defaults from options.
     *
     * @class Spinner
     * @implements {ISpinner}
     *
     * @param {JQuery} inputElement - Input element
     * @param {JQuery} buttonElement - Buttons element
     * @param {number} width - Input width
     * @param {SpinnerEvents} spinnerType - Defines type of input
     * @param {boolean} scrollable - Adds and subtracts value by mouse scrolling
     * @param {number} precision - Number precision
     * @param {number} step - How much to increase or decrease the value
     * @param {string} value - Input value
     * @param {string} dateFormat - Custom format of date and/or time based on moment.js component
     * @param {string} stepUnit - This defines which unit (day, hour...) should be used for changing value
     */
    var Spinner = (function () {
        function Spinner(el, options) {
            this.precision = 0;
            this.step = 1;
            this.scrollable = false;
            $.extend(this, options);
            this.inputElement = $(el);
            this.value = this.inputElement.val() || 0;
            this.inputElement.val(this.value);
            this.inputElement.addClass("form-control spiner");
            if (options.width) {
                this.inputElement.css({ "width": options.width });
            }
            this.buttonElement = $('<div class="input-group-btn-vertical"/>');
            this.buttonElement.append(NumericButton.render("up", "fa fa-caret-up")).append(NumericButton.render("down", "fa fa-caret-down"));
            this.inputElement.after(this.buttonElement);
            var events;
            if (this.spinnerType && typeof this.spinnerType === "function") {
                events = new this.spinnerType(this);
            }
            else {
                events = new Numeric.NumberSpinner(this);
            }
        }
        return Spinner;
    })();
    Numeric.Spinner = Spinner;
    /**
     * This contains one static method to render button.
     *
     * @class NumericButton
     */
    var NumericButton = (function () {
        function NumericButton() {
        }
        /**
         * Renders numeric button.
         *
         * @function render
         * @static
         */
        NumericButton.render = function (direction, icon) {
            return $('<button class="btn btn-default" data-direction="' + direction + '"><i class="' + icon + '"></i></button>');
        };
        return NumericButton;
    })();
})(Numeric || (Numeric = {}));