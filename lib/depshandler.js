var watch = require( 'watch' );
var path = require( 'path' );
var sync = require( './sync' );
var locker = require( 'lockfile' );
var os = require( 'os' );
var utils = require( './utils' );
var fs = require( 'fs' );

/**
 * 创建依赖项【同步】
 * @param srcpath
 * @param destpath
 */
exports.make = function ( srcpath, destpath ) {

    if ( os.platform() == utils.platform.darwin ) {

        ln( '-f', srcpath, destpath );

    } else {

        var lockerf = 'lock.' + path.basename( destpath )
            + '.fis3-wrapper-common-watcher';

        if ( locker.checkSync( lockerf ) ) return;
        locker.lockSync( lockerf );

        var infodestpath = path.basename( destpath );
        var origindestpath = destpath;

        destpath = path.dirname( destpath );

        echo( '\nUse simple copy to make deps: ' + infodestpath );
        cp( '-rf', srcpath, destpath );
        // set watching
        var isWatching = fis3argv.w || fis3argv.watch;
        if ( !fs.lstatSync( origindestpath ).isDirectory() ) {
            origindestpath = path.dirname( origindestpath );
            srcpath = path.dirname( srcpath );
        }
        isWatching && watch.watchTree( origindestpath, function( f, curr, prev ) {
            if ( typeof f == "object" && prev === null && curr === null ) {
                // Finished walking the tree
            } else if ( prev === null ) {
                // f is a new file
                sync.new( f, srcpath, origindestpath );
            } else if ( curr.nlink === 0 ) {
                // f was removed
                sync.remove( f, srcpath, origindestpath );
            } else {
                // f was changed
                sync.modify( f, srcpath, origindestpath );
            }
        } );

        locker.unlockSync( lockerf, function( er ) { } );

    }

};