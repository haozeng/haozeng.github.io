---
layout: post
title: "Email Predictor"
date: 2014-05-28 10:13:51 -0700
comments: true
categories: [ruby, object-oriented-design]
---

I wrote a email predictor recently which Given the following sample dataset:

```ruby
{
  "John Ferguson" => "john.ferguson@alphasights.com",
  "Damon Aw" => "damon.aw@alphasights.com",
  "Linda Li" => "linda.li@alphasights.com",
  "Larry Page" => "larry.p@google.com",
  "Sergey Brin" => "s.brin@google.com",
  "Steve Jobs" => "s.j@apple.com"
}
```

It will Predict the email addresses for the following advisors:

```ruby
"Peter Wong", "alphasights.com"
"Craig Silverstein", "google.com"
"Steve Wozniak", "apple.com"
"Barack Obama", "whitehouse.gov"
```

The solution is designed to be object-oriented, and it composes three parts: Pattern, Analyzer and Predictor.

A Pattern handles all business logic related with first_name and last_name in this case.
Its responsibility is solely designed to fulfill the purpose of looking for/predictoring patterns based on first_name and last_name.
In our case, there are four cases, which are first_name_dot_last_name, first_name_dot_last_initial, first_initial_dot_last_initial, first_initial_dot_last_name.

A Analyzer should be created with a raw dataset and a pattern,
and based on instructions defined in patterns, analyzer generate dataset which can be used for further prediction process.

A Predictor should be created with a dataset and a pattern, and its '#formulate' method will take a name and company as input,
and based on exisiting pattern which is processed and stored in dataset, it will predict email addresses for the given name and company.

The philosiphy behind this can be interpreted in this way:
Pattern can easily be replaced with other patterns or a pattern can easily to modifed to accept more business logic based on other attributes.
Analyzer should only care about its given pattern and its given raw data, and generate a dataset.
Predictor should only caret about its given pattern and its given dataset.
Analyzer and Predictor should not know each other.

```ruby
require 'pry'
require 'pp'

class Pattern
  attr_reader :first_name, :last_name

  def split(name)
    @first_name, @last_name = name.split(/[.|\s{1}]/)
  end

  def find
    [first_part, last_part].join('_dot_').to_sym
  end

  def predict(pattern)
    %w(first_initial first_name last_initial last_name).inject([]) do |memo, params|
      memo << send(params) if pattern.to_s =~ /#{params}/
      memo
    end.join('.')
  end

  private

  def first_initial
    @first_name[0]
  end

  def last_initial
    @last_name[0]
  end

  def first_part
    @first_name.length == 1 ? 'first_initial' : 'first_name'
  end

  def last_part
    @last_name.length == 1 ? 'last_initial' : 'last_name'
  end
end

class Analyzer
  attr_reader :dataset, :pattern

  def initialize(attributes)
    @dataset = {}
    @pattern = attributes[:pattern]
  end

  def process(raw_data)
    raw_data.each do |_, email_address|
      name, email = email_address.split('@')
      @pattern.split(name)
      pattern = @pattern.find

      @dataset[email] ||= []
      @dataset[email] << pattern unless @dataset[email].include?(pattern)
    end
  end
end

class Predictor
  attr_reader :pattern, :dataset

  def initialize(attributes)
    @dataset = attributes[:dataset]
    @pattern = attributes[:pattern]
  end

  def formulate(attributes)
    name = attributes[:name].downcase
    email = attributes[:email]

    return "There is no matching in dataset for #{attributes[:name]} working for #{email}" if @dataset[email].nil?

    @dataset[email].map do |pattern|
      @pattern.split(name)
      @pattern.predict(pattern) + "@#{email}"
    end
  end
end

# Instructions to run:

raw =
{
  "John Ferguson" => "john.ferguson@alphasights.com",
  "Damon Aw" => "damon.aw@alphasights.com",
  "Linda Li" => "linda.li@alphasights.com",
  "Larry Page" => "larry.p@google.com",
  "Sergey Brin" => "s.brin@google.com",
  "Steve Jobs" => "s.j@apple.com"
}
# Create a analyzer object and give it a pattern
analyzer = Analyzer.new(pattern: Pattern.new)
# Analyze the given dataset
analyzer.process(raw)
# Create a predictor object and give it a dataset and a pattern
predictor = Predictor.new(dataset: analyzer.dataset, pattern: Pattern.new)

# Formulate potential patterns for given name and email
pp predictor.formulate(name: 'Criag Silverstein', email: 'google.com')
pp predictor.formulate(name: 'Peter Wong', email: 'alphasights.com')
pp predictor.formulate(name: 'Steve Wozniak', email: 'apple.com')
pp predictor.formulate(name: 'Barack Obama', email: 'whitehouse.gov')

```

Specs

```ruby

# Instruction to run test:
# rspec -fd email_predictor_spec.rb

require './email_predictor'

describe Pattern do
  let(:pattern) { Pattern.new }

  it 'should respond to first name' do
    expect(pattern).to respond_to(:first_name)
  end

  it 'should respond to last name' do
    expect(pattern).to respond_to(:last_name)
  end

  describe '#split' do
    it 'should split name into first_name and last_name if name is separted by white space' do
      pattern.split('John Ferguson')
      expect(pattern.first_name).to eql('John')
      expect(pattern.last_name).to eql('Ferguson')
    end

    it 'should split name into first_name and last_name if name is separted by .' do
      pattern.split('steve.jobs')
      expect(pattern.first_name).to eql('steve')
      expect(pattern.last_name).to eql('jobs')
    end
  end

  describe '#find' do
    it 'should generate pattern if first and last are full' do
      pattern.split('john.ferguson')
      expect(pattern.find).to eql(:first_name_dot_last_name)
    end

    it 'should generate pattern if first is initial and last is full' do
      pattern.split('j.ferguson')
      expect(pattern.find).to eql(:first_initial_dot_last_name)
    end

    it 'should generate pattern if first is full and last are initial' do
      pattern.split('john.f')
      expect(pattern.find).to eql(:first_name_dot_last_initial)
    end

    it 'should generate pattern if both are initial' do
      pattern.split('j.f')
      expect(pattern.find).to eql(:first_initial_dot_last_initial)
    end
  end

  describe '#predict' do
    it 'should be able to predict for first_name_dot_last_name' do
      pattern.split('john ferguson')
      expect(pattern.predict(:first_name_dot_last_name)).to eql('john.ferguson')
    end

    it 'should be able to predict for first_initial_dot_last_name' do
      pattern.split('john ferguson')
      expect(pattern.predict(:first_initial_dot_last_name)).to eql('j.ferguson')
    end

    it 'should be able to predict for first_name_dot_last_initial' do
      pattern.split('john ferguson')
      expect(pattern.predict(:first_name_dot_last_initial)).to eql('john.f')
    end

    it 'should be able to predict for first_initial_dot_last_initial' do
      pattern.split('john ferguson')
      expect(pattern.predict(:first_initial_dot_last_initial)).to eql('j.f')
    end
  end
end

describe Analyzer do

  let(:pattern) { Pattern.new }
  let(:analyzer) { Analyzer.new pattern: pattern }

  it 'should respond to dataset' do
    expect(analyzer).to respond_to(:dataset)
  end

  it 'should use hash as dataset' do
    expect(analyzer.dataset).to be_a(Hash)
  end

  it 'should respond to raw data' do
    expect(analyzer).to respond_to(:pattern)
  end

  describe '#process' do

    let(:raw) { { "John Ferguson" => "john.ferguson@alphasights.com" } }

    it 'should use pattern to split name and find pattern' do
      pattern.should_receive(:split)
      pattern.should_receive(:find).and_return(:first_name_dot_last_name)
      analyzer.process(raw)
    end

    it 'should be able to process data based on given rule' do
      analyzer.process(raw)
      expect(analyzer.dataset.size).to eql(1)
      expect(analyzer.dataset).to eql('alphasights.com' => [:first_name_dot_last_name])
    end

    let(:multiple) do
      {
        "John Ferguson" => "john.ferguson@alphasights.com",
        "Damon Aw" => "damon.aw@alphasights.com",
        "Linda Li" => "linda.li@alphasights.com",
        "Larry Page" => "larry.p@google.com"
      }
    end

    it 'should be albe to process data for multiple companies' do
      analyzer.process(multiple)
      expect(analyzer.dataset.size).to eql(2)
      expect(analyzer.dataset).to eql('alphasights.com' => [:first_name_dot_last_name],
                                      'google.com' => [:first_name_dot_last_initial])
    end
  end
end

describe Predictor do
  let(:pattern) { Pattern.new }
  let(:predictor) { Predictor.new pattern: pattern }

  it 'should respond to dataset' do
    expect(predictor).to respond_to(:dataset)
  end

  it 'should respond to pattern' do
    expect(predictor).to respond_to(:pattern)
  end

  describe '#formulate' do
    it 'should not formulate a email address if company is not given in the dataest' do
      predictor = Predictor.new pattern: pattern, dataset: {}
      attributes = { name: 'Barack Obama', email: 'whitehouse.gov'}
      response = predictor.formulate(attributes)
      expect(response).to eql("There is no matching in dataset for #{attributes[:name]} working for #{attributes[:email]}")
    end

    it 'should use pattern to split name and predict email' do
      predictor = Predictor.new pattern: pattern, dataset: { 'alphasights.com' => [:first_name_dot_last_name] }
      attributes = { name: 'Peter Wong', email: 'alphasights.com'}
      pattern.should_receive(:split).and_return(true)
      pattern.should_receive(:predict).and_return('peter.wong')
      predictor.formulate(attributes)
    end

    it 'should predict email address based if one pattern exist' do
      predictor = Predictor.new pattern: pattern, dataset: { 'alphasights.com' => [:first_name_dot_last_name] }
      attributes = { name: 'Peter Wong', email: 'alphasights.com'}
      response = predictor.formulate(attributes)
      expect(response).to eql(['peter.wong@alphasights.com'])
    end

    it 'should predict email address based if multiple patterns exist' do
      predictor = Predictor.new pattern: pattern, dataset: { 'google.com' => [:first_name_dot_last_initial, :first_initial_dot_last_name] }
      attributes = { name: 'Criag Silverstein', email: 'google.com' }
      response = predictor.formulate(attributes)
      expect(response).to match_array(['c.silverstein@google.com', 'criag.s@google.com'])
    end
  end
end
```
