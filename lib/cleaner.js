var fs = require( 'fs' );
var path = require( 'path' );
var locker = require( 'lockfile' );
var shelljs = require( 'shelljs' );
var watch = require( 'watch' );
var os = require( 'os' );
var utils = require( './utils' );

var tempdir = shelljs.tempdir();

/**
 * build之后【可能的话，恢复初态】：1，删除软链；2，删除.gitignore
 * @param dependencies
 * @param env
 */
module.exports = function ( dependencies, env ) {

    var cwd = env.cwd;

    dependencies.forEach( function ( el, index ) {
        el = utils.cleardeppath( el );
        var targetDep = path.join( cwd, el );
        if ( !fs.existsSync( targetDep ) ) return;
        var lockerf = 'lock.' + el.replace( /\//g, '_' )
            + '.fis3-wrapper-common-simple-copy';
        try {
            locker.lockSync( lockerf );
        } catch( e ) { return; }
        //if( os.platform() == utils.platform.darwin ) {
        //    try {
        //        fs.unlinkSync( targetDep );
        //    } catch ( e ) { }
        //} else {
            rm( '-rf', targetDep );
        //}
        // 清除上层文件夹
        var upper = el.split( '/' )[ 0 ];
        var upperdir = path.join( cwd, upper );
        fs.existsSync( upperdir ) && rm( '-rf', upperdir );
        locker.unlockSync( lockerf, function( er ) { } );

    } );

    var lockerf = 'lock.gitignore.fis3-wrapper-common-simple-copy';
    try {
        locker.lockSync( lockerf );
    } catch( e ) { return; }
    var filename = '.gitignore';
    var targetfile = path.join( cwd, filename );
    if ( !fs.existsSync( targetfile ) ) return;
    try {
        fs.unlinkSync( targetfile );
    } catch ( e ) { }
    locker.unlockSync( lockerf, function( er ) { } );

}