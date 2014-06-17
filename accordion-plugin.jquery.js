// accordion / collapser 
; (function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = 'collapse',
        defaults = {
            closeOnLoad: true,
            validationFunction: undefined 
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;

        // merge defaults & passed in options, preserving original defaults
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        errors: 0, // track errors that prevent sections from closing

        init : function () {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element 
            // and this.options

            // save "this" for use in each loop
            var collapse = this;
            this.allSections = $(this.element).find(".collapseContent");

            // close sections
            if (this.options.closeOnLoad) {
                this.closeAll({validate:false});
            }

            // open any as needed
            this.allSections.filter(".expandedOnLoad").each(function () {
                collapse.openSection(this);
            });

            // bind events
            $(this.element).find(".collapseBar").each(function () {
                $(this).on("click.collapse", function (event) {
                    if ($(this).parent(".collapseSection").hasClass("expanded")){
                        collapse.closeSection($(this).siblings(".collapseContent"), true);
                    } else {
                        collapse.closeAll({validate:true});
                        collapse.openSection($(this).siblings(".collapseContent"));
                    }
                    
                });
            });
         
        },

        closeAll: function (options) {
            var defautOptions = {
                validate: false // validate each section before closing it
            };
            var settings = $.extend({}, defautOptions, options);
            this.errors = 0;
            // save "this" for use in each loop
            var collapse = this;
            // close each section
            this.allSections.each(function () {
                collapse.closeSection(this, settings.validate);
            });
        },

        closeSection: function (section, validate) {
            // only need to validate section if flag is passed, & if its currently open
            var validateMe = false;
            if (validate && $(section).parent(".collapseSection").hasClass("expanded")) {
                validateMe = true;
            }

            if ((validateMe && this.validateSection(section)) || !validate) {
                $(section).slideUp(function () {
                    $(this).closest(".collapseSection").addClass("collapsed").removeClass("expanded");
                });
            }
        },

        openSection: function ( section ) {
            if (!this.errors) {
                $(section).slideDown(function () {
                    $(this).closest(".collapseSection").addClass("expanded").removeClass("collapsed");
                });
            }
        },

        validateSection: function (section) {
            var errors = 0;
            var $section = $(section);
            var collapse = this;
            // check for open progressive logic forms
            $section.find(".formOpen").each(function () {
                errors++;
                var $addForm = $(this).find(".providersync_progressive_addForm").first(); // there can only be one, but still
                // validate form to highlight any required fields
                collapse.options.validationFunction($addForm);
                // its an error even if the form validates, since it hasn't been saved.
                $addForm.addClass("hasError");
            });
            // and validate the form section in general
            var $formSection = $section.find(".providerSyncForm").first();
            if ($formSection.length > 0){
               // window.log("there's a form section to validate " + $formSection.length)
               // window.log($formSection);

                if (!collapse.options.validationFunction($formSection)) {
                    errors++;
                }
            }
            

            if (errors) {
                this.errors = errors;
                return false;
            }
            return true;
        }

    }; // end Plugin.prototype


    // A really lightweight plugin wrapper around the constructor, 
    // preventing against multiple instantiations
    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                new Plugin(this, options));
            }
        });
    }

})(jQuery, window, document);