/**
 * Simple Instagram images plugin (widget style)
 * @author Tomas Matis (tomas.matis@symbio.cz)
 *
 * @version 0.1.1
 * @param {Object} options Additional (optional) parameters.
*/

(function($) {

    $.fn.instagram = function(options) {

        /**
         * Instagram
         * @constructor
         * @param {String} target Selector of target.
         * @param {Object} options Additional (optional) parameters.
        */
        var Instagram = function(target, options) {
            this.domTarget = $(target);

            this.options = $.extend({
                user_id: 999999,            // {Number} - Your instagram user_id.
                access_token: '999999.abcedfghchijklmopqrstuvxyz',  // {String} - Instagram access_token.
                media_count: 1,             // {Number} - Number of images to display.
                large_images: false         // {Boolean} - Display large (612x612px) or small (306x306px) images.
            }, options || {});

            this.images = [];
            this.getImages();
        };


        /*
         * Prototype
         */

        Instagram.prototype = {

            /**
             * getImages
             * Create an array from instagram images
             */
            getImages: function() {
                var opts = this.options;

                this.domTarget
                    .css({
                        'width': opts.large_images ? 612 : 306,
                        'height': opts.large_images ? 612 : 306
                    })
                    .append('<em>Loading...</em>');

                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    cache: false,
                    url: 'https://api.instagram.com/v1/users/' +
                            opts.user_id + '/media/recent/?access_token=' +
                            opts.access_token + '&count=' +
                            opts.media_count,
                    success: $.proxy(function(json) {
                        var items = json.data;
                        $.each(items, $.proxy(function(i, item) {
                            this.images.push({
                                name: item.caption ? item.caption.text : 'Instagram photo',
                                link: item.link,
                                largeSrc: item.images.standard_resolution.url,
                                largeWidth: item.images.standard_resolution.width,
                                largeHeight: item.images.standard_resolution.height,
                                smallSrc: item.images.low_resolution.url,
                                smallWidth: item.images.low_resolution.width,
                                smallHeight: item.images.low_resolution.height
                            });
                        }, this));
                        this.displayImages();
                    }, this)
                });
            },


            /**
             * displayImages
             * Append loaded images to this.domTarget
             */
            displayImages: function() {
                var opts = this.options;
                $.each(this.images, $.proxy(function(i, elm) {
                    var
                        img = $(new Image()),
                        link = $('<a/>')
                            .attr('title', elm.name)
                            .attr('href', elm.link)
                            .attr('target', '_blank')
                            .append(img
                                .attr('src', opts.large_images ? elm.largeSrc : elm.smallSrc)
                                .attr('width', opts.large_images ? elm.largeWidth : elm.smallWidth)
                                .attr('height', opts.large_images ? elm.largeHeight : elm.smallHeight)
                            );
                    img.on('load', $.proxy(function() {
                        this.domTarget.find('em').remove();
                        this.domTarget.append(link);
                    }, this));
                }, this));
            }

        };

        /*
         * jquery chaining
         */

        var i;
        this.each(function() {
            i = new Instagram(this, options);
        });
        return i;
    };
    
})(jQuery);