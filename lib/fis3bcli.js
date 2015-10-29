var packinfo = require( '../package.json' );

/**
 * 自定义参数提示
 * @param argv
 * @param fis
 * @returns {boolean}
 */
module.exports = function ( argv, fis, env ) {

    if ( argv[ 'H' ] ) {

        var options =  {
            '-H': 'print this help message',
            '-V': 'print current fis-wrapper-common version',
            'clear': 'clear project, you can: `fis3b clear`'
        };

        console.log( '\nFis3-wrapper-common command list:' );
        console.log( '-------------------------------\n' );
        console.log( ( function (){

            var out = '';
            for ( var key in options ){
                out += ( key + ': ' + options[ key ] + '\n' );
            }

            return out;
        } )() );

        return true;

    }

    if ( argv[ 'V' ] ) {

        console.log( 'Fis3-wrapper-common ==> version ' + packinfo.version );

        return true;
    }

    if ( ~ argv[ '_' ].indexOf( 'clear' ) ) {

        require( env.configPath );

        var dependencies = fis.config.get( 'project.dependencies' );
        require( './afterbuild' )( dependencies, env );

        console.log( 'current project cleared! :p' );

        return true;
    }

    return false;

}