// textarea character count
; (function ($, window, document, undefined) {

    // Create the defaults once
    var pluginName = 'charCount',
        defaults = {
            maxChars: 1000,
            counterWrapClass: "editor_character_count",
            counterClass: "counter",
            limitClass: "limit",
            parentClass: "editorWrap",
            errorClass: "red"
        };

    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        this.$element = $(element);

        // merge defaults & passed in options, preserving original defaults
        this.options = $.extend({}, defaults, options);

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {
        errors: 0, // track errors that prevent sections from closing

        init: function () {
            var charCounter = this; // for use in the binding

            this.$parent = this.$element.parents("." + this.options.parentClass);
            this.$counter = this.$parent.find("." + this.options.counterClass);
            this.$limit = this.$parent.find("." + this.options.limitClass);
            this.$counterLine = this.$parent.find("." + this.options.counterWrapClass);
            this.curCount;

            // update limit display
            this.$limit.html(this.options.maxChars);

            // initialize char count (it could be more than zero if they are editing an existing value)
            this.updateCount(this.$element.val().length);

            //binding
            $(this.element).on('keyup', function () {
                var count = $(this).val().length;
                // reset error class
                charCounter.$counterLine.removeClass(charCounter.options.errorClass);
                // too many
                if (count > charCounter.options.maxChars) {
                    charCounter.overLimit();
                } else {
                    charCounter.updateCount(count);
                }

            });
        },

        updateCount: function (count) {
            // update if needed
            if (count !== this.curCount) {
                this.curCount = count;
                this.$counter.html(this.curCount);
            }
        },

        overLimit: function () {
            this.$element.val(this.$element.val().substring(0, this.options.maxChars));
            this.$counterLine.addClass(this.options.errorClass);
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