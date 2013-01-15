require 'erb'
require 'uglifier'

def load_file(path)
  raise "nothing at #{path}" if Dir[path].empty?
  files = Dir[path].to_a.sort.map do |f|
    File.read(f)
  end
  files.join("\n")
end

file

task :build do
  File.open(File.expand_path("./Leap.js", Dir.pwd), "w") { |f| f << ERB.new(File.read("./Leap.js.erb")).result }
  File.open(File.expand_path("./Leap.min.js", Dir.pwd), "w") { |f| f << Uglifier.new.compile(File.read("./Leap.js")) }
end