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
        if(input_json[key].substr(0,1) != "/") {
          input_json[key] = "/" + input_json[key];
        }
        if(input_json[key].substr(-1,1) != "/") {
          input_json[key] = input_json[key] + "/";
        }
        var src_key = key;
        if(key.substr(-1,1) != "/") {
          src_key = key + "/";
        }
        files_sync_config.push({
          action: 'upload',
          expand: true,
          cwd: options.files_root,
          src: src_key + 'index.html',
          dest: '',
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
