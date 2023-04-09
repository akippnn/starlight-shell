import { Network  } from './network.js'
import { Media } from './media.js'
import { Battery } from './battery.js'
import { Bluetooth } from './bluetooth.js'
import { Notifications } from './notifications.js'
import GObject from 'gi://GObject?version=2.0'
import Gio from 'gi://Gio?version=2.0'
import GLib from 'gi://GLib?version=2.0'
import Gtk from 'gi://Gtk?version=3.0'

const TICK_INTERVAL = 1000 //ms
export const NOTIFICATIONS_BANNER_TIME_OUT = 5000
export const PREFERRED_PLAYER = 'spotify'
export const CACHE_PATH = GLib.get_user_cache_dir()+'/aylur/'
export const MEDIA_CACHE_PATH = CACHE_PATH+'media/'
export const NOTIFICATIONS_CACHE_PATH = CACHE_PATH+'notifications/'

export const PlayerIcons = {
    'deafult': '',
    'spotify': '',
    'firefox': '󰈹',
    'mpv': ''
}

export function MkDirectory() {
    [ 
        CACHE_PATH,
        MEDIA_CACHE_PATH,
        NOTIFICATIONS_CACHE_PATH
    ]
    .forEach(path => {
        if(!GLib.file_test(path, GLib.FileTest.EXISTS))
            Gio.File.new_for_path(path)
                .make_directory(null);
    })
}

const App = GObject.registerClass(
class App extends Gtk.Application{
    constructor({ eww, file, stdout, fg_color }) {
        super({
            application_id: 'com.github.aylur.myshell',
            flags: Gio.ApplicationFlags.DEFAULT_FLAGS
        });

        MkDirectory();

        this._eww = eww;
        this._file = file;
        this._stdout = stdout;
        this._json = {};

        this._notifications = new Notifications(fg_color);
        this._battery = new Battery();
        this._network = new Network();
        this._bluetooth = new Bluetooth();
        this._media = new Media();

        this.run(null);
    }

    vfunc_activate() {
        this.hold();

        this._notifications.connect('sync', o => this._output(o.json, 'notifications'));
        this._notifications.emit('sync');

        this._battery.connect('sync', o => this._output(o.json, 'battery'));
        this._network.connect('sync', o => this._output(o.json, 'network'));
        this._bluetooth.connect('sync', o => this._output(o.json, 'bluetooth'));

        this._media.connect('sync', o => this._output(o.json, 'media'));
        this._media.connect('positions', o => this._output(o.positions, 'media_positions'));
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, TICK_INTERVAL, () => this._media.getPositions() );
    }

    _output(json, name){
        if(this._file) {
            const file = Gio.File.new_for_path(CACHE_PATH+name+'.json');
    
            if(!GLib.file_test(file.get_path(), GLib.FileTest.EXISTS))
                file.create(Gio.FileCreateFlags.NONE, null);
    
            file.replace_contents(JSON.stringify(json, null, 2), null, false,
                Gio.FileCreateFlags.REPLACE_DESTINATION, null);
        }
    
        if(this._eww) {
            let [success, out, err, wait] = GLib.spawn_command_line_sync(
                `eww update ${name}=${JSON.stringify(JSON.stringify(json))}`
            );
            if(!success) log(err);
        }

        if(this._stdout) {
            this._json[name] = json;
            print(JSON.stringify(this._json, null, 2));
        }
    }
})

function parseArgs(argv) {
    let args = {};
    for(let i=0; i<argv.length; ++i) {
        switch (argv[i]) {
            case '--help': args.help = true; break;
            case '--eww': args.eww = true; break;
            case '--file': args.file = true; break;
            case '--stdout': args.stdout = true; break;
            case '--fg-color': args.fg_color = argv[i++]; break;
            default: break;
        }
    }
    return args;
}

export function main(argv) {
    let { help, eww, file, stdout, fg_color } = parseArgs(argv);
    if( (!eww && !file && !stdout) || help) {
        print('Usage:', argv[0], '[--eww] [--file] [--stdout]');
        return;
    }
    print('Cache directory:', CACHE_PATH);
    new App({ eww, file, stdout, fg_color });
}
