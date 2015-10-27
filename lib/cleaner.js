require( 'shelljs/global' );
var fs = require( 'fs' );
var path = require( 'path' );

/**
 * build之后【可能的话，恢复初态】：1，删除软链；2，删除.gitignore
 * @param dependencies
 * @param env
 */
module.exports = function ( dependencies, env ) {

    var cwd = env.cwd;

    try {

        dependencies.forEach( function ( el, index ) {
            var targetDep = path.join( cwd, path.basename( el ) );
            if ( !fs.existsSync( targetDep ) ) return;
            fs.unlinkSync( targetDep );
        } );

        var filename = '.gitignore';
        var targetfile = path.join( cwd, filename );
        if ( !fs.existsSync( targetfile ) ) return;
        fs.unlinkSync( targetfile );

    } catch ( e ) {

    }

}