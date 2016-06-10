/*
 * aws-s3-redirects
 * https://github.com/manoj/sandbox
 *
 * Copyright (c) 2016 Manoj Krishnan
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('aws_s3_redirects', 'Manage static site redirects on AWS S3.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    var input_json = grunt.file.readJSON(options.redirects_json_path);
    var files_sync_config = [];
    var files_cleanup_config = [];

    for(var key in input_json) {
      if(input_json.hasOwnProperty(key)) {
        var regex = /\/\//g;
        var dest_path = ('/' + key + '/').replace(regex, '/');
        var source_path = (options.files_root + '/' + key + '/').replace(regex, '/');
        input_json[key] = ('/' + input_json[key] + '/').replace(regex, '/');

        files_sync_config.push({
          action: 'upload',
          expand: true,
          cwd: source_path,
          src: ['index.html'],
          dest: dest_path,
          params: {
            WebsiteRedirectLocation: (input_json[key])
          }
        });
      }
    }

    grunt.config.set('aws_s3.' + options.sync_task_name + '.files', files_sync_config);
    grunt.task.run(['aws_s3:' + options.sync_task_name]);
  });

};
