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

    //if ( os.platform() == utils.platform.darwin ) {
    //
    //    if ( fs.lstatSync( srcpath ).isDirectory() ) {
    //        srcpath.lastIndexOf( '/' ) != ( srcpath.length - 1 )
    //            && ( srcpath += '/' );
    //    }
    //
    //    ln( '-f', srcpath, destpath );
    //
    //} else {

        var lockerf = 'lock.' + path.basename( destpath )
            + '.fis3-wrapper-common-watcher';

        if ( locker.checkSync( lockerf ) ) return;
        locker.lockSync( lockerf );

        var infodestpath = path.basename( destpath );
        var origindestpath = destpath;

        destpath = path.dirname( destpath );

        echo( 'Use simple copy to make deps: ' + infodestpath );
        cp( '-rf', srcpath, destpath );
        // set watching
        var isWatching = fis3argv.w || fis3argv.watch;
        if ( !fs.lstatSync( origindestpath ).isDirectory() ) {
            origindestpath = path.dirname( origindestpath );
            srcpath = path.dirname( srcpath );
        }

        if ( isWatching ) {
            global.watchesTree.push( origindestpath );
            watch.watchTree( origindestpath, function( f, curr, prev ) {
                if ( typeof f == "object" && prev === null && curr === null ) {
                    // Finished walking the tree
                } else if ( prev === null ) {
                    // f is a new file
                    sync.new( f, srcpath, origindestpath );
                } else if ( curr.nlink === 0 ) {
                    // f was removed
                    // TODO: 为了安全开发，暂时去掉删除文件的同步操作，因为很有可能会误删
                    // sync.remove( f, srcpath, origindestpath );
                    echo( '\nDelete syncing has been disabled for safety.Don\'t worry.:-)' );
                    echo(
                        '\nBecause you have just stopped other fis3 watching thread' +
                        '\nyou should restart current watching thread to recover project dependencies.'
                    );
                } else {
                    // f was changed
                    sync.modify( f, srcpath, origindestpath );
                }
            } );
        }

        locker.unlockSync( lockerf, function( er ) { } );

    //}

};