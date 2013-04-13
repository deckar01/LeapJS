require 'erb'
require 'uglifier'

def load_file(prepath, path)
  raise "nothing at #{prepath}" if Dir[prepath].empty?
  raise "nothing at #{path}" if Dir[path].empty?
  prefiles = Dir[prepath].to_a.sort.map do |f|
    File.read(f)
  end
  files = Dir[path].to_a.sort.map do |f|
    File.read(f)
  end
  prefiles.join("\n") + files.join("\n")
end

file

task :build do
  File.open(File.expand_path("./Leap.js", Dir.pwd), "w") { |f| f << ERB.new(File.read("./Leap.js.erb")).result }
  File.open(File.expand_path("./Leap.min.js", Dir.pwd), "w") do |f|
    filedata = File.read("./Leap.js")
	puts "Leap.js length: #{filedata.length} (before uglifier)"
    filedata = Uglifier.new.compile(filedata)
	puts "Leap.min.js length: #{filedata.length} (after uglifier)"
	varhash = Hash.new
	filedata.scan(/(_[\w\d]+)/) { |n| varhash[n[0]] = (varhash[n[0]]?varhash[n[0]]:0)+n[0].length }
	privatevars = (varhash.sort_by { |n,c| c }).reverse
	alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvw"
	counter = 0
	shortname = alphabet[0]
	privatevars.each do |e|
	  if shortname.length <= e[0].length
		varhash[e[0]] = shortname
	    counter += 1
		if counter < alphabet.length
		  shortname = "#{alphabet[counter]}"
		else
		  a = alphabet[counter/alphabet.length-1]
		  b = alphabet[counter%alphabet.length]
		  shortname = "#{a}#{b}"
		end
	  else
	    varhash.delete e[0]
	    puts "#{e[0]} skipped"
      end
	end
	safevars = (varhash.sort_by { |n,c| n.length }).reverse
	safevars.each do |e|
	  filedata.gsub! /#{e[0]}/,e[1]
	  puts "#{e[0]} => #{e[1]}"
	end
	puts "Leap.min.js length: #{filedata.length} (after private variable replacement)"
	f << filedata
  end
end