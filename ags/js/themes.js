/**
 * A Theme is a set of options that will be applied
 * ontop of the default values. see options.js for possible options
 */
import { Theme, WP, lightColors } from './settings/theme.js';

export default [
    Theme({
        "name": "starlight",
        "icon": "🌠",
        'desktop.wallpaper.img': WP + 'starlight.jpg',
        "theme.accent.accent": "#6c6e85",
        "theme.accent.gradient": "to right, $accent, lighten($accent, 6%)",
        'theme.widget.opacity': 95,
        'border.opacity': 97,
        'theme.bg': 'transparentize(#171717, 0.3)',
        "bar.style": "separated",
        'font.font': "Ubuntu Nerd Font Regular",
    }),
    Theme({
        name: 'Leaves',
        icon: '󰌪',
        'desktop.wallpaper.img': WP + 'leaves.jpg',
        'theme.accent.accent': '$green',
        'theme.accent.gradient': 'to right, $accent, darken($accent, 14%)',
        'theme.widget.opacity': 92,
        'border.opacity': 86,
        'theme.bg': 'transparentize(#171717, 0.3)',
        'bar.style': 'floating',
        'radii': 0,
    }),
    Theme({
        name: 'Ivory',
        icon: '<U+F07C6>',
        ...lightColors,
        'desktop.wallpaper.img': WP + 'ivory.png',
        'desktop.wallpaper.fg': '$bg_color',
        'desktop.screen_corners': false,
        'bar.style': 'separated',
        'theme.widget.bg': '$accent',
        'theme.widget.opacity': 64,
        'desktop.drop_shadow': false,
        'border.width': 2,
        'border.opacity': 0,
        'theme.accent.gradient': 'to right, $accent, darken($accent, 6%)',
        'hypr.inactive_border': 'rgba(111111FF)',
        'bar.separators': false,
    }),
    Theme({
        name: 'Space',
        icon: '',
        'desktop.wallpaper.img': WP + 'space.jpg',
        'spacing': 11,
        'padding': 10,
        'radii': 12,
        'theme.accent.accent': '$magenta',
        'desktop.screen_corners': false,
        'desktop.clock.enable': false,
        'bar.separators': false,
        'theme.bg': 'transparentize(#171717, 0.3)',
        'theme.widget.opacity': 95,
        'bar.flat_buttons': false,
    }),
];
