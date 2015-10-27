require( 'shelljs/global' );
var path = require( 'path' );
var fs = require( 'fs' );
var gi = require( 'parse-gitignore' );

/**
 * build之前：1，创建软链；2，写入.gitignore
 * @param dependencies
 * @param env
 */
module.exports = function ( dependencies, env ) {

    if ( !dependencies )
        return;

    if ( !dependencies.length )
        return;

    var cwd = env.cwd;

    typeof dependencies == 'string' && ( dependencies = [ dependencies ] );

    var gitignore = [ ];

    dependencies.forEach( function ( el, index ) {
        // 依赖的实际路径
        var thisDep = path.join( cwd, el );
        // 创建到当前项目路径下
        var targetDep = path.join( cwd, path.basename( el ) );

        if ( fs.existsSync( targetDep ) ) return;

        echo( '\nMaking dependenciy for ' + thisDep );
        ln( '-f', thisDep, targetDep );
        echo( '\nDone making dependenciy :)' );

        // .gitignore
        gitignore.push( path.basename( el ) );
        gitignore.push( path.basename( el ) + '/**' );

    } );

    var filename = '.gitignore';
    var targetfile = path.join( cwd, filename );
    var patterns = fs.existsSync( targetfile )
        ? gi( targetfile, gitignore )
        : gitignore;

    fs.writeFileSync( targetfile, patterns.join( '\n' ) );

}