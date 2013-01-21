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
  File.open(File.expand_path("./Leap.min.js", Dir.pwd), "w") do |f|
    filedata = File.read("./Leap.js")
	puts "Leap.js length: #{filedata.length} (before uglifier)"
    filedata = Uglifier.new.compile(filedata)
	puts "Leap.min.js length: #{filedata.length} (after uglifier)"
	privatevars = Hash.new
	filedata.scan(/(_[\w\d]+)/) { |n| privatevars[n[0]]=(privatevars[n[0]]?privatevars[n[0]]:0)+n[0].length }
	privatevars = (privatevars.sort_by { |n,c| c }).reverse
	alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvw"
	counter = 0
	shortname = alphabet[0]
	privatevars.each do |e|
	  if shortname.length < e[0].length
		filedata.gsub! /#{e[0]}/,shortname
		puts "#{e[0]} => #{shortname}"
	    counter += 1
		if counter < alphabet.length
		  shortname = "#{alphabet[counter]}"
		else
		  a = alphabet[counter/alphabet.length-1]
		  b = alphabet[counter%alphabet.length]
		  shortname = "#{a}#{b}"
		end
      end
	end
	puts "Leap.min.js length: #{filedata.length} (after private variable replacement)"
	f << filedata
  end
end