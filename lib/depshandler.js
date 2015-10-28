var watch = require( 'watch' );
var path = require( 'path' );
var sync = require( './sync' );
var locker = require( 'lockfile' );

/**
 * 创建依赖项【同步】
 * @param srcpath
 * @param destpath
 */
exports.make = function ( srcpath, destpath ) {

    try {

        ln( '-f', srcpath, destpath );

    } catch( e ) {

        var lockerf = 'lock.' + path.basename( destpath )
            + '.fis3-wrapper-common-watcher';

        locker.lock( lockerf, { }, function( er ) {
            if (er) return;

            var infodestpath = path.basename( destpath );
            var origindestpath = destpath;

            destpath = path.dirname( destpath );

            echo( '\nUse simple copy to make deps: ' + infodestpath );
            cp( '-rf', srcpath, destpath );
            // set watching
            var isWatching = fis3argv.w || fis3argv.watch;
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

            locker.unlock( lockerf, function( er ) { } );
        });

    }

};