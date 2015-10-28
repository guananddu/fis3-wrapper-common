var fs = require( 'fs' );
var path = require( 'path' );
var locker = require( 'lockfile' );
var shelljs = require( 'shelljs' );
var watch = require( 'watch' );
var os = require( 'os' );

var tempdir = shelljs.tempdir();

/**
 * build之后【可能的话，恢复初态】：1，删除软链；2，删除.gitignore
 * @param dependencies
 * @param env
 */
module.exports = function ( dependencies, env ) {

    var cwd = env.cwd;

    dependencies.forEach( function ( el, index ) {
        var targetDep = path.join( cwd, path.basename( el ) );
        if ( !fs.existsSync( targetDep ) ) return;
        var lockerf = 'lock.' + path.basename( el )
            + '.fis3-wrapper-common-simple-copy';
        if ( locker.checkSync( lockerf ) ) return;
        locker.lockSync( lockerf );
        if ( os.platform() == 'darwin' ) {
            fs.unlinkSync( targetDep );
        } else {
            rm( '-rf', targetDep );
        }
        locker.unlockSync( lockerf, function( er ) { } );
    } );

    var lockerf = 'lock.gitignore.fis3-wrapper-common-simple-copy';
    if ( locker.checkSync( lockerf ) ) return;
    locker.lockSync( lockerf );
    var filename = '.gitignore';
    var targetfile = path.join( cwd, filename );
    if ( !fs.existsSync( targetfile ) ) return;
    fs.unlinkSync( targetfile );
    locker.unlockSync( lockerf, function( er ) { } );

}