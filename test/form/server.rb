#
# A simple server to emulate slow requests to the server
# so that we could test the Form#cancelXhr method
#
# Copyright (C) 2011 Nikolay Nemshilov
#

require 'rubygems'
require 'sinatra'

get '/' do
  sleep 3
  if params[:callback]
    "#{params[:callback]}(#{params[:response]})"
  else
    params[:response] || ''
  end
end

post '/' do
  sleep 3
  params[:response] || ''
end