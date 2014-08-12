package Plack::Middleware::Debugger::Collector;

use strict;
use warnings;

use parent 'Plack::Middleware';

use Plack::Util::Accessor (
    'debugger', # a reference to the Plack::Debugger
);

sub call {
    my ($self, $env) = @_;

    my $resp = $self->app->call( $env );

    return $resp;
}

1;

__END__