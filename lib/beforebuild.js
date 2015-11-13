var path = require( 'path' );
var fs = require( 'fs' );
var gi = require( 'parse-gitignore' );
var depshandler = require( './depshandler' );
var mkdirp = require( 'mkdirp' );
var utils = require( './utils' );

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
        el = utils.cleardeppath( el );
        var targetDep = path.join( cwd, el );
        if ( fs.existsSync( targetDep ) ) return;
        // 确保上层目录是存在的
        !fs.existsSync( path.dirname( targetDep ) )
            && mkdirp.sync( path.dirname( targetDep ) );

        echo( '\nMaking dependenciy for ' + thisDep );
        depshandler.make( thisDep, targetDep );
        // ln( '-f', thisDep, targetDep );
        echo( '\nDone making dependenciy :)' );

        // .gitignore
        var ignore = el.split( '/' )[ 0 ];
        gitignore.push( '/' + ignore );
        gitignore.push( '/' + ignore + '/**' );

    } );

    var filename = '.gitignore';
    var targetfile = path.join( cwd, filename );
    if ( fs.existsSync( targetfile ) )
        return;
    //var patterns = fs.existsSync( targetfile )
    //    ? gi( targetfile, gitignore )
    //    : gitignore;
    var patterns = function (){
        var res = [ ];
        for ( var i = 0, len = gitignore.length; i < len; i ++ ) {
            ! ~ res.indexOf( gitignore[ i ] )
                && ( res.push( gitignore[ i ] ) );
        }
        return res;
    }();

    fs.writeFileSync( targetfile, patterns.join( '\n' ) );

}