var fs = require( 'fs' );
var path = require( 'path' );
var locker = require( 'lockfile' );
var shelljs = require( 'shelljs' );
var watch = require( 'watch' );
var fs = require( 'fs' );

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
        locker.lock( lockerf, { }, function( er ) {
            if ( er ) return;
            try {
                fs.unlinkSync( targetDep );
            } catch ( e ) {
                rm( '-rf', targetDep );
            } finally {
                locker.unlock( lockerf, function( er ) { } );
            }
        } );

    } );

    var lockerf = 'lock.gitignore.fis3-wrapper-common-simple-copy';
    locker.lock( lockerf, { }, function( er ) {
        if ( er ) return;
        var filename = '.gitignore';
        var targetfile = path.join( cwd, filename );
        if ( !fs.existsSync( targetfile ) ) return;
        fs.unlinkSync( targetfile );
        locker.unlock( lockerf, function( er ) { } );
    } );

}