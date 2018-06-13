#!/usr/bin/perl -w

use strict;
use LWP::Simple;
use HTML::TreeBuilder;
use File::Basename 'fileparse';

my $url = 'http://sig-sc.org/seminar_list.html';
my $html = get($url);

#DOMを生成する
my $dom = HTML::TreeBuilder->new;
$dom->parse($html);


## ダウンロードフォルダを作成
mkdir "file", 0755;
## リンクを取得
for my $a ($dom->find('a')) {
	my $link = $a->attr('href') || "none";
	if ($link =~ /^file/) {
		my ($basename, $dirname) = fileparse $link;
		my $fileUrl = 'http://sig-sc.org/'.$link;
		mkdir $dirname, 0755;
		print STDERR "Fetching $basename in $link\n";
		getstore($fileUrl, $link);
	} 
}

