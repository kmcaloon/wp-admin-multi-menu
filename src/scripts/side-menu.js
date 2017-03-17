/**
 * Setup a multi level admin menu for WP
 *
 * Custom menu items with the class .js-menu-section must first
 * be created to divide up the regular menu items into sections.
 * All regular menu items that preceed a .js-menu-section will appear
 * as a submenu of the preceeding .js-menu-section.
 *
 */
import * as Enscroll from './vendor/enscroll';

( function SideMenu( $ ) {

    $(window).load( function() {

        var $sectionHeads = $('li.js-menu-section');

        // Create menu sections
        createSections( $sectionHeads );

        // Set up collapsing events
        collapsingEvents( $sectionHeads );

        // Make all submenus fit into viewport
        fitMenusToViewport();

        // Custom clicking events
        clickingEvents();

    });

   
    /**
     * Create menu sections
    */
    function createSections( $sectionHeads ) {

        // Cycle through each section
        $sectionHeads.each( function() {

            // Sync all menu items between section heading and next separator
            var $sectionItems = $(this).nextUntil( '.wp-menu-separator', '.menu-top:not(.js-menu-section)' );
            $sectionItems.addClass( 'section-item' );

        });

        // Make section heading current if child is current
        var $activeSection = $('li.wp-has-current-submenu').prevUntil( '.js-menu-section' );
        var $submenuItems = $activeSection.nextUntil( '.wp-menu-separator', '.menu-top:not(.js-menu-section)' );

        $activeSection.addClass( 'is-collapsed' );
        $submenuItems.addClass( 'is-collapsed' );

    }

    /**
     * Collapsing events
     */
    function collapsingEvents( $sectionHeads ) {

        // User clicks on section head
        $sectionHeads.on( 'click', function() {

            var $otherSections =  $('li.js-menu-section').not( this );
            var $submenuItems = $(this).nextUntil( '.wp-menu-separator', '.menu-top:not(.js-menu-section)' );
            var $otherItems = $otherSections.nextUntil( '.wp-menu-separator', '.menu-top:not(.js-menu-section)' );

            // Uncollapse other menus
            $otherSections.removeClass( 'is-collapsed' );
            $otherItems.removeClass( 'is-collapsed' );

            // Make sure this section head is active
            $(this).toggleClass( 'is-collapsed' );

            // Show/hide all menu items between section heading and next separator
            $submenuItems.toggleClass( 'is-collapsed' );

        } );

    }

    /**
     * Adjust submenus so that the fit within viewport
     */
    function fitMenusToViewport() {

        checkMenus();
        setupScrollBars();

        /*
         * Check all menus to see if they need to be adjusted
         */
        function checkMenus() {

            var $submenus = $('.wp-submenu');
            var $hasSubmenu = $('.wp-has-submenu');

            // Go through each menu to check it's height/position relative to view port
            $hasSubmenu.on( 'hover', function() {

                var viewportHeight = $(window).height();
                var $submenu = $(this).find( '.wp-submenu' );
                
                if( $submenu.length ) {

                    // Reset to natural height
                    $submenu.removeClass( 'is-scrollable' );
                    $submenu.css( 'max-height', '1000px' );

                    var $menuContainer = $('#adminmenuback');
                    var menuHeight = $submenu.outerHeight();
                    var offsetTop = $submenu.offset().top - $menuContainer.offset().top;
                    var menuPosition = menuHeight + offsetTop;

                    // Adjust f bottom of menu exceeds viewport
                    if( menuPosition > viewportHeight ) {

                        adjustMenu( $submenu, offsetTop, viewportHeight );

                    }
                }
            } );
        }

        /**
         * Adjust menu so bottom does not exceed viewport
         */
        function adjustMenu( $submenu, offsetTop, viewportHeight ) {

            var adjustedHeight = viewportHeight - offsetTop - 20;

            $submenu.addClass( 'is-scrollable' );
            $submenu.css( 'max-height', adjustedHeight );

        }

        /**
         * Setup custom scroll bars
         */
        function setupScrollBars() {

            $('.wp-submenu').enscroll( {

                verticalHandleClass: 'handle',
                scrollIncrement: 15,
                easingDuration: 300

            } );
        }
    }

    /**   
     * Clicking events
     */
    function clickingEvents() {

        disableSubHeadings();

        /**
         * Disable submenu label clicks
         */
        function disableSubHeadings() {

            var $subHeading = $('a.wp-has-submenu');

            $subHeading.on( 'click', function( event ) {

                event.preventDefault();

            } );
        }
    }

} )( jQuery );